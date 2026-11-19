
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200

    assert response.json() == {
        "status": "ok",
        "service": "AI Personal Travel Assistant API",
    }


def test_frontend_cors():
    response = client.get(
        "/health",
        headers={
            "Origin": "http://localhost:5173",
        },
    )

    assert response.status_code == 200

    assert (
        response.headers["access-control-allow-origin"]
        == "http://localhost:5173"
    )
