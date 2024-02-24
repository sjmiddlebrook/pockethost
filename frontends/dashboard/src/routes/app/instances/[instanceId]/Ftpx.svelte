<script lang="ts">
  import CodeSample from '$components/CodeSample.svelte'
  import Card from '$components/cards/Card.svelte'
  import CardHeader from '$components/cards/CardHeader.svelte'
  import { DOCS_URL, FTP_URL } from '$src/env'
  import { client } from '$src/pocketbase-client'
  import { bash } from 'svelte-highlight/languages'

  const { user } = client()
  const { email } = user() || {}

  // This will hide the component if the email was not found
  if (!email) {
    throw new Error(`Email expected here`)
  }
  const ftpUrl = FTP_URL(email)
</script>

<Card>
  <CardHeader documentation={DOCS_URL(`/usage/ftp`)}>FTP Access</CardHeader>

  <p class="mb-8">
    Securely access your instance files via FTPS. Use your PocketHost account
    login and password.
  </p>

  <p>Bash:</p>

  <div class="mb-12">
    <CodeSample code={`ftp ${ftpUrl}`} language={bash} />
  </div>

  <table class="table">
    <thead>
      <tr>
        <th class="border-b-2 border-neutral">Directory</th>
        <th class="border-b-2 border-neutral">Description</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <th>backups</th>
        <td>The PocketBase backups directory</td>
      </tr>
      <tr>
        <th>hooks</th>
        <td>The PocketBase JS hooks directory</td>
      </tr>
      <tr>
        <th>migrations</th>
        <td>The PocketBase migrations directory</td>
      </tr>
      <tr>
        <th>public</th>
        <td>Public files, such as a web frontend</td>
      </tr>
      <tr>
        <th>storage</th>
        <td>The PocketBase uploaded file storage directory</td>
      </tr>
    </tbody>
  </table>
</Card>
