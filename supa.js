const SUPABASE_URL = "https://sfwfyzjzzfpisuzsgnrf.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmd2Z5emp6emZwaXN1enNnbnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Nzg1NjUsImV4cCI6MjA3ODM1NDU2NX0.v5VlZgEiWG45Gl2W_nd5o9C94UY2EUIZiI19loOFgOM"
const { createClient } = supabase

const supClient = createClient(SUPABASE_URL, SUPABASE_KEY)

const supChannel = supClient.channel('tictactoe', {
  config: {
    broadcast: {
      self: true,
    },
  },
})

supChannel
  .on('broadcast', { event: 'move' }, (payload) => console.log(payload))
  .subscribe((status) => {
    console.log(status)
    if (status === 'SUBSCRIBED') {
      supChannel.send({
        type: 'broadcast',
        event: 'joined',
        payload: { org: 'supabase' },
      })
    }
  })
