export const pr_summary_prompt = ({
    title, description, file_diff
}:{
   title:string,
   description?:string, 
   file_diff:string,
   suggegested_changes?: string
}) => {
   const pr_main_summary_prompt =
   `## GitHub PR Title

       \`${title}\` 

       ## Description

       \`\`\`
       ${description}
       \`\`\`

       ## Diff

       \`\`\`diff
       ${file_diff}
       \`\`\`

       ## Instructions

       Your task is to provide a concise summary of the changes. This 
       summary will be used as a prompt while reviewing each file and must be very clear for 
        the AI bot to understand. 

        Instructions:

        - Focus on summarizing only the changes in the PR and stick to the facts.
        - Add code blocks of the changes you find from ${file_diff} and give explanation their
        - The summary should not exceed 600 words.
        - Your summary should include a note about alterations 
        to the signatures of exported functions, global data structures and 
        variables, and any changes that might affect the external interface or 
        behavior of the code.

        ### Example changes
        ---new_hunk---
        \`\`\`
        z = x / y
            return z

        20: def add(x, y):
        21:     z = x + y
        22:     retrn z
        23: 
        24: def multiply(x, y):
        25:     return x * y

        def subtract(x, y):
        z = x - y
        \`\`\`
        
        ---old_hunk---
        \`\`\`
        z = x / y
            return z

        def add(x, y):
            return x + y

        def subtract(x, y):
            z = x - y
        \`\`\`

        ---comment_chains---
        \`\`\`
        Please review this change.
        \`\`\`

        ---end_change_section---

        ### Example response

        22-22:
        There's a syntax error in the add function.
        \`\`\`diff
        -    retrn z
        +    return z
        \`\`\`
        ---
       `

   return pr_main_summary_prompt
}

export const commit_main_summary_prompt = ({
    title, file_diff
}:{
   title:string,
   file_diff:string,
}) => {
   const commit_main_sum_prompt =
   `## GitHub Commit Title

       \`${title}\` 

       ## Diff

       \`\`\`diff
       ${file_diff}
       \`\`\`


       ## Instructions

       Your task is to provide a concise summary of the changes. This 
        summary must be very clear to understand. 

        Instructions:

        - Focus on summarizing only the changes in the commit and stick to the facts.
        - Add very small code blocks and line number of the changes you find from $fill_diff 
        - Never provide the entire code
        - Just give small snippits of code and line numbers
        - Try to explain more in summary below the snippit
        - Don't explain each line of code one by one give enitre summary

        - 'Never give code like these 
            WorkflowCanvas.vue** Line 23 shows the removal of the showBugReportingButton prop.
        diff
        --- a/packages/editor-ui/src/components/canvas/WorkflowCanvas.vue
        +++ b/packages/editor-ui/src/components/canvas/WorkflowCanvas.vue
        @@ -23,7 +23,6 @@'

        - If giving code just give from +++ part
        - The summary should not exceed 600 words.
       `

   return commit_main_sum_prompt
}

