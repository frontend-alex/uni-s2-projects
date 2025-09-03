namespace CircusProject.Core.Services;

using CircusProject.Core.Enums;
using CircusProject.Core.Models;

public class PackingService {
    private const int WagonCapacity = 10;
    private const int MaxExperimental = 4;

    public List<Wagon> Pack(IEnumerable<Animal> animals) {
        var sorted = animals
            .OrderByDescending(a => Points(a))
            .ToList();


        var wagons = new List<Wagon>();
        int experimentalUsed = 0;

        foreach (var animal in sorted) {
            if (TryPlaceInExisting(wagons, animal)) continue;

            Wagon newWagon = new Wagon { HasSeparators = false };
            if (!TryAdd(newWagon, animal)) {
                if (experimentalUsed < MaxExperimental && IsSmallOrMedium(animal)) {
                    newWagon = new Wagon { HasSeparators = true };
                    experimentalUsed++;
                    // with separators it must accept small/medium animal as first
                    TryAdd(newWagon, animal);
                }
                else {
                    // as first animal in an empty normal wagon, any single animal fits
                    TryAdd(newWagon, animal);
                }
            }
            wagons.Add(newWagon);
        }
        return wagons;
    }

    public bool TryPlaceInExisting(List<Wagon> wagons, Animal animal) {
        foreach (var w in wagons) {
            if (TryAdd(w, animal)) return true;
        }
        return false;
    }

    public bool TryAdd(Wagon wagon, Animal animal) {
        var used = wagon.Animals.Sum(Points);
        if (used + Points(animal) > WagonCapacity) return false;
        if (!IsSafe(wagon, animal)) return false;
        wagon.Animals.Add(animal);
        return true;
    }

    public bool IsSafe(Wagon wagon, Animal candidate) {
        // carnivores eat equal or smaller
        if (candidate.Diet == Diet.Carnivore) {
            if (wagon.HasSeparators && IsSmallOrMedium(candidate)) {
                if (wagon.Animals.Count >= 2) return false;
                if (wagon.Animals.Count == 1) {
                    var other = wagon.Animals[0];
                    return IsSmallOrMedium(other); // any small/medium animal ok
                }
                return true; // first animal
            }
            // normal wagon: all existing must be larger than candidate
            return wagon.Animals.All(a => Points(a) > Points(candidate));
        }
        // herbivore
        bool anyCarnivore = wagon.Animals.Any(a => a.Diet == Diet.Carnivore);
        if (!anyCarnivore) return true;
        if (wagon.HasSeparators && IsSmallOrMedium(candidate)) {
            if (wagon.Animals.Count >= 2) return false;
            return wagon.Animals.All(a => a.Diet == Diet.Carnivore && IsSmallOrMedium(a));
        }
        // unsafe if any carnivore equal or larger
        return wagon.Animals.All(a => a.Diet != Diet.Carnivore || Points(a) < Points(candidate));
    }

    public static int Points(Animal a) => a.Size switch {
        Size.Small => 1,
        Size.Medium => 3,
        Size.Large => 5,
        _ => 0
    };

    private static bool IsSmallOrMedium(Animal a) => a.Size == Size.Small || a.Size == Size.Medium;
}
