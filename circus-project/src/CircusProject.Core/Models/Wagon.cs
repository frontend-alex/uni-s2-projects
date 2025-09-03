namespace CircusProject.Core.Models;

public class Wagon {
    public bool HasSeparators { get; set; }
    public List<Animal> Animals { get; set; } = new();
}
