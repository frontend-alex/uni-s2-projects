repo/
├─ docs/                         # ADRs, sequence diagrams, threat models
├─ build/                        # pipelines, versioning, codegen
├─ deploy/                       # IaC, Helm charts, env overlays
├─ tests/
│  ├─ Project.UnitTests/
│  ├─ Project.IntegrationTests/
│  ├─ Project.ComponentTests/    # API + fakes
│  └─ Project.ContractTests/     # Pact/Schema; optional
└─ src/
   ├─ Project.Shared/            # framework-agnostic primitives only
   │  ├─ Abstractions/           # IClock, IIdGenerator
   │  ├─ Core/                   # Result<T>, Maybe<T>, Error
   │  ├─ Guard/                  # Guard.Against(...)
   │  └─ Extensions/             # String/DateTime/Enum helpers
   │
   ├─ Project.Domain/            # pure business; no infra/web deps
   │  ├─ Entities/
   │  ├─ Aggregates/
   │  ├─ ValueObjects/
   │  ├─ Enums/
   │  ├─ DomainEvents/
   │  └─ Specifications/         # optional Spec pattern
   │
   ├─ Project.Application/       # use cases + contracts; thin orchestration
   │  ├─ Contracts/              # ports: repositories, email, tokens, bus
   │  ├─ Features/               # vertical slices per capability
   │  │  └─ Users/
   │  │     ├─ Commands/CreateUser/
   │  │     │  ├─ CreateUserCommand.cs
   │  │     │  ├─ Handler.cs
   │  │     │  └─ Validator.cs
   │  │     └─ Queries/GetUser/
   │  │        ├─ Query.cs
   │  │        ├─ Handler.cs
   │  │        └─ Dto.cs
   │  ├─ Behaviors/              # MediatR pipeline: validation, caching, logging
   │  ├─ Mappings/               # Entity ↔ DTO (AutoMapper profiles)
   │  └─ Validators/             # FluentValidation for DTOs/commands
   │
   ├─ Project.Infrastructure/    # adapters to external systems
   │  ├─ Persistence/
   │  │  ├─ EfCore/              # DbContext, migrations, repos
   │  │  ├─ Mongo/               # client, conventions, collections
   │  │  └─ Outbox/              # outbox table/collection + dispatcher
   │  ├─ Messaging/              # Kafka/Rabbit/ServiceBus producers/consumers
   │  ├─ Security/               # JwtTokenService, PasswordHasher (if needed)
   │  ├─ Email/                  # SendGrid/SMTP impls of IEmailSender
   │  ├─ Files/                   # Blob storage adapters
   │  ├─ Observability/          # OTEL exporters, Serilog sinks
   │  └─ Mappings/               # Persistence ↔ Domain mappers
   │
   └─ Project.WebApi/            # presentation + composition root
      ├─ Endpoints/              # Minimal API groups per feature
      ├─ Controllers/            # if MVC; otherwise omit
      ├─ Middleware/             # custom middleware
      ├─ Setup/                  # DI & pipeline extensions
      │  ├─ Security/            # AddAppSecurity/UseAppSecurity
      │  ├─ Swagger/             # AddApiDocumentation/UseApiDocumentation
      │  ├─ HealthChecks/
      │  ├─ Cors/
      │  └─ RateLimiting/
      ├─ Configuration/          # Options bound from appsettings (e.g., JwtOptions)
      ├─ Mappers/                # thin HTTP model ↔ DTO mappers (if not using AutoMapper)
      ├─ Program.cs
      └─ appsettings*.json
