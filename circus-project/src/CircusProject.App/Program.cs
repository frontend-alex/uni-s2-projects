using System.Text.Json;
using CircusProject.Core.Enums;
using CircusProject.Core.Models;
using CircusProject.Core.Services;

var jsonPath = Path.Combine(AppContext.BaseDirectory, "data", "animals.json");
if (!File.Exists(jsonPath))
{
    Console.WriteLine($"Data file not found: {jsonPath}");
    return;
}

var json = await File.ReadAllTextAsync(jsonPath);
var items = JsonSerializer.Deserialize<List<AnimalDto>>(json, new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true
});

if (items is null || items.Count == 0)
{
    Console.WriteLine("No animals in data file.");
    return;
}

var animals = new List<Animal>();
foreach (var dto in items)
{
    if (!Enum.TryParse<Diet>(dto.Diet, out var diet) || !Enum.TryParse<Size>(dto.Size, out var size))
    {
        Console.WriteLine($"Invalid entry skipped: diet={dto.Diet}, size={dto.Size}");
        continue;
    }
    animals.Add(new Animal { Diet = diet, Size = size });
}

var service = new PackingService();
var wagons = service.Pack(animals);

Console.WriteLine($"Total wagons: {wagons.Count}");

for (int i = 0; i < wagons.Count; i++)
{
    var w = wagons[i];
    var used = w.Animals.Sum(PackingService.Points);
    var remaining = 10 - used;
    Console.WriteLine($"Wagon {i + 1} {(w.HasSeparators ? "(experimental)" : "(normal)")}: used={used}, remaining={remaining}");
    foreach (var a in w.Animals)
    {
        Console.WriteLine($"  - {a.Diet} {a.Size} ({PackingService.Points(a)})");
    }
}

record AnimalDto(string Diet, string Size);
