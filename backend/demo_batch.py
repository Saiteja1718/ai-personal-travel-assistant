
from app.services.recommendations import (
    create_recommendation_chain,
    make_recommendation_input,
)


# Create the LCEL pipeline
chain = create_recommendation_chain()


# Prepare multiple inputs
inputs = [
    make_recommendation_input(
        destination="New York",
        interests=["museums", "food"],
        preferences=["budget-friendly"],
    ),

    make_recommendation_input(
        destination="Paris",
        interests=["art", "architecture"],
        preferences=["walking"],
    ),

    make_recommendation_input(
        destination="Tokyo",
        interests=["technology", "anime"],
        preferences=["public transport"],
    ),
]


# Run the same chain for multiple inputs
results = chain.batch(
    inputs,
    config={"max_concurrency": 2},
)


# Display the outputs
for index, result in enumerate(results, start=1):
    print(f"\n{'=' * 45}")
    print(f"TRAVEL REQUEST {index}")
    print("=" * 45)
    print(result)
