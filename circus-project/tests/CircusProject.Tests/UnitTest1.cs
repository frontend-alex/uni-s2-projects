using CircusProject.Core.Enums;
using CircusProject.Core.Models;
using CircusProject.Core.Services;
using Xunit;

namespace CircusProject.Tests;

public class PackingServiceTests {
    [Fact]
    public void Packs_Within_Capacity_And_Safety() {
        var animals = new List<Animal>
        {
            new() { Diet = Diet.Carnivore, Size = Size.Large },
            new() { Diet = Diet.Carnivore, Size = Size.Medium },
            new() { Diet = Diet.Herbivore, Size = Size.Large },
            new() { Diet = Diet.Herbivore, Size = Size.Medium },
            new() { Diet = Diet.Herbivore, Size = Size.Small },
        };

        var svc = new PackingService();
        var wagons = svc.Pack(animals);

        Assert.NotEmpty(wagons);
        foreach (var w in wagons) {
            var used = w.Animals.Sum(PackingService.Points);
            Assert.True(used <= 10);
            // safety: if there is a carnivore, ensure no equal/smaller herbivore in same wagon
            foreach (var c in w.Animals.Where(a => a.Diet == Diet.Carnivore)) {
                Assert.DoesNotContain(w.Animals, a => a.Diet == Diet.Herbivore && PackingService.Points(a) <= PackingService.Points(c));
            }
        }
    }

    [Fact]
    public void Experimental_Allows_SmallMedium_Pairings() {
        var animals = new List<Animal>
        {
            new() { Diet = Diet.Carnivore, Size = Size.Medium },
            new() { Diet = Diet.Carnivore, Size = Size.Small },
            new() { Diet = Diet.Herbivore, Size = Size.Medium },
        };

        var svc = new PackingService();
        var wagons = svc.Pack(animals);

        // Should fit in at most 2 wagons due to experimental pairing
        Assert.True(wagons.Count <= 2);
    }
}