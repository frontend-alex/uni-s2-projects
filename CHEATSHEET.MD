# 🚀 C# / .NET Core Cheat Sheet

### 🔧 CLI Basics

# create new console app
```
dotnet new console -n MyApp
```
# create new web api
```
dotnet new webapi -n MyApi
```

# create new class library
```
dotnet new classlib -n MyLib
```

# create new test project
```
dotnet new xunit -n MyApp.Tests
```

# build project
```
dotnet build
```

# run project
```
dotnet run
```

# run tests
dotnet test
```

# add package
dotnet add package PACKAGE_NAME
```
# add project reference
```
dotnet add MyApi/MyApi.csproj reference MyLib/MyLib.csproj
```

# restore dependencies
```
dotnet restore
```

# publish for release
```
dotnet publish -c Release
```

---

### 🏗️ Access Modifiers & Keywords

* `public` → available everywhere
* `private` → only inside the same class
* `protected` → inside class + subclasses
* `internal` → only in same assembly/project
* `protected internal` → protected + internal
* `private protected` → only in same class or subclass in same assembly

**Other important keywords:**

* `static` → belongs to class, not instance
* `const` → compile-time constant
* `readonly` → set only in constructor
* `virtual` → can be overridden
* `override` → replaces virtual method
* `abstract` → must be implemented by child class
* `sealed` → cannot be inherited

---

### 🧱 Object-Oriented Building Blocks

```csharp
public class Person
{
    public string Name { get; set; }   // property
    private int age;                   // private field

    public Person(string name, int age) // constructor
    {
        Name = name;
        this.age = age;
    }

    public virtual void Speak() => Console.WriteLine("Hello");
}

public class Employee : Person
{
    public string JobTitle { get; set; }
    public override void Speak() => Console.WriteLine("Working...");
}
```

### 🧮 LINQ (Like JS array methods, but stronger)

```csharp
var evens = numbers.Where(n => n % 2 == 0);     // filter
var doubled = numbers.Select(n => n * 2);       // map
var total = numbers.Sum();                      // reduce
var first = numbers.FirstOrDefault();           // first element
var grouped = users.GroupBy(u => u.Department); // group by
```


### 🧭 SOLID Principles

**Guidelines for clean OOP design:**

1. **S**ingle Responsibility → one class = one purpose
2. **O**pen/Closed → open for extension, closed for modification
3. **L**iskov Substitution → subclasses should stand in for parents
4. **I**nterface Segregation → many small interfaces > one big interface
5. **D**ependency Inversion → depend on abstractions, not concretes

Think: keep classes focused, flexible, swappable, and decoupled.


### 🧰 Common Patterns

* **Repository** → abstracts data access
* **Service Layer** → holds business logic
* **Dependency Injection** → provided by default in ASP.NET Core
* **DTOs** → Data Transfer Objects, keep API models clean


