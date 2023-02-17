const SUPABASE_URL = "https://lbozubrlkudonsaefqet.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxib3p1YnJsa3Vkb25zYWVmcWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY1NjI1ODIsImV4cCI6MTk5MjEzODU4Mn0.OagUu0A_m1sG7eeUi_BGKOuNa1nJ6OnrpgdmuNeij_E"
const { createClient } = supabase

const supClient = createClient(SUPABASE_URL, SUPABASE_KEY)

const supChannel = supClient.channel('test', {
  config: {
    broadcast: {
      self: true,
    },
  },
})

supChannel
  .on('broadcast', { event: 'supa' }, (payload) => console.log(payload))
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      supChannel.send({
        type: 'broadcast',
        event: 'supa',
        payload: { org: 'supabase' },
      })
    }
  })
