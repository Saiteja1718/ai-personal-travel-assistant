
from statistics import mean

from app.schemas import ParallelTravelRequest

from app.services.parallel_data import (
    get_parallel_travel_data,
)


request = ParallelTravelRequest(
    destination="Paris",
    duration_days=2,
    travelers=2,
    interests=["art", "architecture"],
    budget=600,
    currency="USD",
)


def benchmark(mode: str, runs: int = 3):
    measurements = []

    for run_number in range(1, runs + 1):
        result = get_parallel_travel_data(
            request=request,
            mode=mode,
        )

        measurements.append(result.elapsed_ms)

        print(
            f"{mode} | Run {run_number}: "
            f"{result.elapsed_ms:.2f} ms"
        )

    return mean(measurements)


if __name__ == "__main__":
    print("\n=== SEQUENTIAL BENCHMARK ===")
    sequential_avg = benchmark("sequential")

    print("\n=== PARALLEL BENCHMARK ===")
    parallel_avg = benchmark("parallel")

    print("\n=== RESULTS ===")
    print(
        f"Sequential average: {sequential_avg:.2f} ms"
    )

    print(
        f"Parallel average: {parallel_avg:.2f} ms"
    )

    if parallel_avg > 0:
        speedup = sequential_avg / parallel_avg

        print(
            f"Measured speedup: {speedup:.2f}x"
        )
