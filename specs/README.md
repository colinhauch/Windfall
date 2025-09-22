This directory contains specification documents that provide a high level overview of SABS and major features. As we

## Writing Guidelines

### Premise

This directory contains specification documents that provide a high level overview of SABS and major features. As we work on a new feature we will first create and evolve a specification before we work on the code. We will keep these specs updated over time to reflect the current state. The documents are numbered to help denote the history. (The documents are stored in Git, and we therefore can look back in Git to see the state of the system as it evolved over time.)

### Document Structure

- Create new documents as markdown files with short names in snake-case that describe the feature
- Begin file names with the next two-digit number to maintain time-based sorting
- Use clear hierarchical headings (##, ###) to organize content logically
- Include cross-references to related specs using relative links (e.g., `[04_live_edit_pvc.md](04_live_edit_pvc.md)`)

### Writing Style

- **Prefer readable paragraphs over bullet points** for describing functionality, architecture, and processes
- Use bullet points sparingly, primarily for configuration options, lists of states, or reference information
- Write in a professional, technical documentation tone that explains both what and why
- Include concrete examples like table schemas, configuration flags, and code snippets where helpful

### Content Organization

- Start with problem statements or overviews that provide context
- Include actual implementation details (table schemas, API signatures, etc.) rather than just descriptions
- Organize complex information using tables for easy reference (configuration options, environment settings, etc.)
- Document state machines with both state definitions and transition descriptions
- Include sections on testing, security, and operational considerations where relevant
- If needed, include brief summaries of alternatives that were considered, with a list the important pros and cons, and the reason why each was rejected.

### Maintenance Principles

- Keep specs updated to reflect current implementation, not just initial designs
- Include specific metric names, configuration flags, and database schemas from the actual codebase
- Reference existing specs to avoid duplication and build on established concepts
- Ensure links work both on GitHub.com and in local development environments like Cursor

## Specs Folder Structure and Usage Summary

### **Organizational Framework**

**Numbering Convention**: Specs follow a two-digit sequential numbering system (`01_`, `02_`, `03_`, etc.) that provides chronological ordering and indicates the evolutionary history of features. This numbering system enables time-based sorting and helps track the development progression of the system.

**File Naming**: Documents use snake_case naming with descriptive titles that clearly identify the feature or system component being documented.

**Cross-Referencing**: Specs maintain interconnections through relative markdown links (e.g., `[04_live_edit_pvc.md](04_live_edit_pvc.md)`), creating a web of related documentation that builds upon established concepts.

### **Document Architecture Pattern**

**Hierarchical Structure**: All specs follow a consistent multi-level heading structure:

- **Level 1** (`#`): Document title with number and feature name
- **Level 2** (`##`): Major conceptual sections
- **Level 3** (`###`): Detailed subsections and implementation specifics
- **Level 4** (`####`): Fine-grained details and sub-processes

**Common Section Types**: Most specs contain recurring section patterns:

- **Problem/Overview sections**: Context and motivation
- **Architecture sections**: System design and component relationships
- **Implementation sections**: Technical details and concrete specifications
- **API/Database sections**: Schemas, endpoints, and data structures
- **Configuration sections**: Settings, flags, and deployment options
- **Testing/Security sections**: Quality assurance and safety considerations
- **Future/Alternatives sections**: Roadmap items and design decisions

### **Content Presentation Patterns**

**Technical Specifications**: Heavy use of code blocks (`sql`, go, etc.) for database schemas, API definitions, configuration examples, and implementation snippets.

**Structured Data**: Extensive use of markdown tables for:

- Configuration options with flags, environment variables, and defaults
- State transition matrices showing system behavior
- Comparison tables for different environments or alternatives
- Reference tables for API endpoints and parameters

**Prose Style**: Following the README guidelines, specs prefer readable paragraphs over bullet points for describing functionality, architecture, and processes, using bullets primarily for lists and reference information.

### **Maintenance and Evolution Model**

**Living Documentation**: Specs are designed to be updated continuously to reflect current implementation rather than just initial designs, including specific metric names, configuration flags, and database schemas from the actual codebase.

**Design Decision Recording**: Documents include sections on rejected alternatives with pros/cons analysis, providing historical context for architectural choices.

**Implementation Tracking**: Specs contain concrete implementation details like actual table schemas, API signatures, and configuration flags rather than just high-level descriptions.

### **Integration with Development Process**

**Specification-First Development**: The README indicates that specs are created and evolved before code implementation, serving as design documents that guide development.

**Code-Spec Synchronization**: Specs are maintained to stay synchronized with actual implementation, serving as both design documents and current system documentation.

**Multi-Audience Design**: The structure serves both as technical design documents for developers and as comprehensive system documentation for understanding the current state of features.

This structure creates a cohesive documentation system that serves as both forward-looking design specifications and backward-compatible system documentation, with strong interconnections between related features and consistent formatting patterns that make the documentation navigable and maintainable.
