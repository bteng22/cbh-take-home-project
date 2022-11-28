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
- Pointing scale is a Fibonacci scale (1,2,3,5,8,13) and reflects the relative effort of deploying the work into production.
- CORE-NNN are fake story IDs used to refer to dependent tickets

### CORE-100

1. As a Facility client, I want to be able to set a custom ID for our agents, so that agents are easily identifiable and secure for any future reporting.

   Estimation: 3. **Assumption:** This is a relatively small ticket with little risk. The migration is a non-breaking change since it's a new table, however updating `updateFacilityAgent` will now require a custom agent ID, which is a breaking change.

   Context: Currently, the Agent IDs we expose are the internal database IDs for Agents. **(Assumption)**: These IDs are not human-readable and difficult for our clients to relate back to their Agents. It's also a potential security risk and exposing implementation details of our system. This ticket is intended to give our Facility clients the ability to create custom IDs for the Agents that work their Shifts.

   Acceptance Criteria:

   - Given a Facility client  
     When they are assigning a new Agent a Shift  
     Then the Facility should be able to create a custom ID for that Agent

   - Given a Facility client  
     When they are assigning an existing Agent a Shift  
     Then the Facility should be able to update the custom ID for that Agent

   - Custom IDs should be required/non-nullable
   - Custom IDs should be alphanumeric and can include dashes/unscores, but it should validate against all symbols and spaces.
   - Custom IDs should be unique per Agent per Facility i.e. an Agent could have the same custom ID across two different Facilities since these IDs are only used internally respective of the Facility. However, two Agents of the same Facility cannot share the same custom ID.
   - Frontend changes should reflect [Design mockups here]. Frontend mockups include validation checks against custom IDs.

   Implementation Details:

   - Since each Facility can have their own custom ID for an Agent, we could use a many-to-many relationship. Create a migration for a join table between Agent and Facility that will store the custom ID as a string. Unless specified by the Facility, the default custom ID will take the form `${Agent.name}-${Facility.name}-${date-added-to-facility}` until updated by the Facility.
   - `updateFacilityAgent` should now accept a parameter to update the custom ID of an Agent per Facility. If the custom ID already exists throw a `4xx` error that is surfaced to the client. Check against validation constraints listed above. Error messages:  
     `Failed to update Agent ${Agent.name}. Custom ID ${customID} already exists.`  
     `Failed to update Agent ${Agent.name}. Custom ID ${customID} is invalid.`
   - Frontend validation should require a custom ID and adhere to validation constraints above when inputting an Agent for Shift.

### CORE-200

2. As a Facility client, I want to be able to generate shift reports with our agents' custom IDs, so that agents are easily identifiable during compliance checks.

   BlockedBy: [CORE-100]

   Estimation: 3

   Context: Once Agents have custom IDs per Facility, we want to give our clients the ability to generate shift reports that list their Agents custom Ids for the shifts over a quarterly timeframe. This will allow compliance checks to easily cross-reference the Agents that worked for the Facility.

   Acceptance Criteria:

   - Given a Facility client,  
     When they download shift data for the facility,  
     Then the client should be able to identify each Agent by the custom Ids

   - Given a Facility client,  
     When they generate a quarterly Shift report from the shift data  
     Then the Agents on the reports should show their custom IDs

   - Verify internal database IDs are no longer visible in reports
   - Verify PDF for `generateReports` reflects [PDF mock up]
   - Frontend changes should reflect [Design mock ups here].
   - Example fake JSON responses for both `getShiftsByFacility` and `generateReports`...

   ```
    #getShiftsByFacility
    {
      shifts: [
        agent: {
          id: "CUSTOM_ID"
        }
      ],
      ...
    }
   ```

   ```
    #generateReports
    {
      shifts: [
        agent: {
          id: "CUSTOM_ID"
        }
      ],
      ...
    }
   ```

   Implementation Details:

   - Assuming `getShiftsByFacility` and `generateReports` are built on the backend, the intention of this ticket is to expose the custom ID to our Facility client through these methods/endpoints. Luckily, since we assumed the custom IDs are required and were backfilled through the migration, all Agents should have a custom ID going forward after CORE-100. Assuming the existing methods were returning an `id` for the Agent we could swap that internal database ID with the custom ID now. This change should stabilize the contract between the consumers of these APIs and ideally avoid any breaking changes. All reports going forward should refer to Agents by their custom ID.
