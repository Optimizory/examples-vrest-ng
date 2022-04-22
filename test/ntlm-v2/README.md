## Enable NTLM v2 Authentication

This sample project describes, how you may enable NTLM v2 authentication in vREST NG Application v2.3.3 or below. First we have described steps to try out this sample project directly to check whether NTLMv2 authentication is working in your environment or not. If this project works fine at your end then follow the steps further to understand how you may use NTLM v2 in your own project.

#### Pre-requisites
NodeJS 12.18.3 or later

#### Steps to try out this project directly
1. First download the whole repository `examples-vrest-ng` and extract the directory `test/ntlm-v2`, wherever you want. We are only concerned about this directory `ntlm-v2` as of now, instead of the whole repository.
2. Open this directory `ntlm-v2` in a command prompt or terminal and run the command below:
    ```
    npm install
    ```
3. Now add this project directory `ntlm-v2` in vREST NG Application's workspace area.
4. Now configure the following environment variables in the `Configuration tab` > `Environments / Variables` section.:

    | Variable Name | Remarks  |
    |---|---|
    | username  | Username  |
    | password  | password |
    | domain  | Name of domain.  |
    | workstation | Name of workstation. |
    | securedEndpoint | Any secured GET endpoint to authenticate the current user. |

5. Now run the tests in the `Test cases` tab and if the test passed then your NTLMv2 authentication is working fine.
    * In this test, we are checking against status code `200`. If you are expecting a different status code then modify the test as per your needs.

#### Understand, how this project works

* This project uses an NPM module named as `@ewsjs/ntlm-client` to handle the NTLMv2 authentication. 
* This project configures the environment variables as described in our previous step.
* And also configures a utility method named as `generateNTLMAuthHeader` to generate the NTLM Auth header. 
  * This utility method uses the NPM module and credentials defined in environment variables section to generate the NTLM Auth header.
* Further, this project defines an Authorization named as `NTLM Auth` of type `Raw Authorization` and invokes our utility method `generateNTLMAuthHeader` defined previously.
* Further, this project defines a `pre-test-run` hook to login into the system. This hook uses the authorization `NTLM Auth`.
* Now, in your tests, you don't need to set the `Authorization` field. Because `pre-test-run` will always execute before execution of any tests automatically.

#### Applying NTLM v2 auth in your own project
To apply NTLM v2 auth in your own project, you will need to copy / paste certains files from this project to your project.
1. Copy `package.json` from this project to your project. If your project already have a `package.json` file then just copy the depedencies.
2. Copy utility method `utilities/generateNTLMAuthHeader.js` to your project at the same location.
3. Copy hook `hooks/login_using_ntlmv2.json` to your project at the same location.
4. Make an entry of this hook `login_using_ntlmv2` in the hook category `pre-test-run-hook`. This means, you will need to copy/paste `hooks.json` file to your project as well. If you already have this file in your own project, then just make an entry of this hook.
4. Define the variables named as `username`, `password`, `domain`, `workstation`, `securedEndpoint` in your project as well and configure the desired values.
5. Copy `authorizations/ntlm_auth_v2.json` to your project at the same location.
6. You will need to run the following command in the command prompt/terminal window for your project as well:
    ```
    npm install
    ```
7. Now, in your API tests, you don't need to set this authorization `NTLM Auth`.

That's it.
