## Jira Workflow

This sample project covers the following usage scenario. You may take inspiration from this sample implementation and modify the code shared as per your own custom needs.

-------------------
##### Usage scenario:
If any API test failure occur during test execution in a particular environment:
- Checks whether test case's `External ID` field contains some Jira issue id(s)
    - If Yes
        - Check whether all the linked issue ids are closed or not
            - If all issue(s) are closed
                - Log a new issue with API failure details
            - else 
                - Find any of the not closed issue and add comment with API failure details in that issue. 
    - If No
        - Log a new issue with API failure details  
- Also adds the test case response content as attachment in the issue
-------------------

##### Important points:
1. This project uses a dummy hook to execute the main utility method `logIssueOrComment`.
2. This project includes a sample test case `Failure Test Case` which will be fail upon execution to trigger the post test case iteration hook (dummy hook) that evalutates the hook condition and further invokes the method `logIssueOrComment`.
3. This project uses a npm dependency `form-data` to send multipart requests to Jira for adding the response as attachment. So in order to run this project, first you will need to install the dependencies using the command below:
    ```
    npm install
    ```
4. You will also need to configure the environment variables:
    | Variable Name | Remarks  |
    |---|---|
    | jiraBaseURL  | The base URL of Jira Server.  |
    | jiraAssigneeName  | The user name id of the Jira assignee.  |
    | jiraProjectKey  | The project key in which you would like to log issue or comment.  |
    | jiraUsername | The user name / email of the user for authentication. |
    | jiraApiToken | The API Token of Jira for authentication. |
    | jiraHookEnv | The environment name in which you would like to execute this Jira hook. |
    | jiraClosedStatusName | The status which represents the `closed` status in Jira. By default, it is set to `Done`. |
5. As of now, this dummy hook will not show anything on the UI. We will improve on this front in near future. For the time being, use appropriate `console.log` statements in the methods to debug and to display various milestones.

##### Utility methods:
This project includes the following utility methods for various purposes. You may modify and use them in your project as per your needs:

1. `getJiraAuthHeader`: 
  This method computes and returns the basic authorization header value for the Jira authentication. It uses the variables `jiraUsername` and `jiraApiToken`.

2. `getJiraIssueDescriptionForTestFailure`: 
  This method computes the test failure summary and return it as string. You may use this failure summary as Jira issue description or as a comment.

3. `findIssueIdNotClosed`: 
  This method takes an argument `externalId` and checks the status of all linked issues and returns the first issue id if not closed. Otherwise returns null. 

4. `findJiraIssueStatus`:
  This method takes an argument `issueId` and invokes a Jira REST API and returns its status.

5. `logCommentInJira`:
  This method takes an argument `issueId` and logs a comment in the provided issue id with the failure summary. 

6. `logIssueInJira`:
  This method logs an issue in Jira with the failure summary and returns the issue key.

7. `addResponseAttachmentInJira`:
  This method temporarily saves the response content to file system and then attaches this file in the provided issue id and finally removes the temporarily file. This method is dependent on the npm package `form-data`.

9. `updateExternalId`: 
  This method updates the `External ID` field of the test case. Make sure, you have appropriate permissions to write on the file system. You will need to reload the vREST NG application in order to reflect the updated `External ID` field. If you are using this inside the CI/CD server then you will need to commit the test repository and pull changes to your main test repository.

9. `logIssueOrComment`:
  This method is the main method and implements the overall Jira workflow. This method make use of the above methods to implement the desired workflow that was shared in the begining of this page.
