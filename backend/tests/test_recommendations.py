
from fastapi.testclient import TestClient

from langchain_core.messages import AIMessage
from langchain_core.runnables import RunnableLambda

from app.main import app
from app.services.recommendations import (
    build_recommendation_chain,
    make_recommendation_input,
)


client = TestClient(app)


# Test 1: API endpoint returns recommendations
def test_recommendations_endpoint(monkeypatch):

    def fake_recommendations(
        destination,
        interests,
        preferences,
    ):
        return "1. Museum\n2. Park\n3. Food\n4. Tour\n5. Viewpoint"

    monkeypatch.setattr(
        "app.routers.recommendations.generate_recommendations",
        fake_recommendations,
    )

    response = client.post(
        "/api/v1/recommendations",
        json={
            "destination": "New York",
            "interests": ["museums", "food"],
            "preferences": ["walking"],
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["destination"] == "New York"
    assert "Museum" in data["recommendations"]


# Test 2: Missing destination is rejected
def test_missing_destination():

    response = client.post(
        "/api/v1/recommendations",
        json={
            "interests": ["food"],
            "preferences": [],
        },
    )

    assert response.status_code == 422


# Test 3: LCEL pipeline works with a fake model
def test_lcel_chain():

    def fake_model(prompt_value):
        messages = prompt_value.to_messages()

        assert "Paris" in messages[-1].content

        return AIMessage(
            content="1. Museum\n2. Garden\n3. Cafe\n4. Gallery\n5. River walk"
        )

    fake_llm = RunnableLambda(fake_model)

    chain = build_recommendation_chain(fake_llm)

    result = chain.invoke(
        make_recommendation_input(
            destination="Paris",
            interests=["art"],
            preferences=["walking"],
        )
    )

    assert isinstance(result, str)
    assert "Museum" in result
    assert "River walk" in result


# Test 4: The chain supports batch execution
def test_lcel_batch():

    fake_llm = RunnableLambda(
        lambda prompt: AIMessage(
            content="1. Sample recommendation"
        )
    )

    chain = build_recommendation_chain(fake_llm)

    inputs = [
        make_recommendation_input(
            destination="New York",
            interests=["food"],
            preferences=[],
        ),
        make_recommendation_input(
            destination="Tokyo",
            interests=["technology"],
            preferences=[],
        ),
    ]

    results = chain.batch(inputs)

    assert len(results) == 2
    assert all(
        "Sample recommendation" in result
        for result in results
    )
