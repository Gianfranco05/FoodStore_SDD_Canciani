# admin-crud-config — Configuration Page

## ADDED Requirements

### Requirement: Config page uses shared CRUD patterns
The ConfigPage SHALL use `PageContainer` and `helpContent` from admin-crud-base. Config is a settings page, not a full CRUD — it does not require `useFormModal`, `usePagination`, or `useConfirmDialog`.

#### Scenario: Page structure
- **WHEN** the page renders
- **THEN** it SHALL use `<PageContainer helpContent={helpContent.config}>` wrapping its settings content

#### Scenario: Settings form
- **WHEN** config form is submitted
- **THEN** it SHALL use `useActionState` for form submission with the appropriate API call
