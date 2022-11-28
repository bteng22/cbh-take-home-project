# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Assumptions:

- Our staffing company owns the entire system (frontend/backend) for booking Agents and providing Facilities with an admin dashboard that allows our clients to generate shift reports.
- There is an existing UI or interface that allows Facilities to hook into `getShiftsByFacility` and `generateReport`.
- There is an existing UI and API that allows Facilities to create/update metadata for Agents working their Shifts. For simplicity sake, we'll call this `updateFacilityAgent`
- Validation/constraints for custom IDs for Agents: Values should be alphanumeric and can include dashes/underscores. We should validate against all symbols and spaces. Custom IDs should be required/non-null and unique per Agent per Facility. Custom IDs are required and migration will default to `${Agent.name}-${Facility.name}-${date-added-to-facility}`
- These tickets are vertical slices. In other words, they could require a full stack engineer to expose functionality on the backend and then hook it up on the frontend. Designs for UI were completed and linked in tickets.
- Pointing scale is Fibonacci 1,2,3,5,8,13 and reflects the relative effort of deploying the work into production.
