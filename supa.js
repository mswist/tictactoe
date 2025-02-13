const SUPABASE_URL = "https://yvlybnjleempsjcoyovx.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bHlibmpsZWVtcHNqY295b3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0Mzk3NzIsImV4cCI6MjA1NTAxNTc3Mn0.lJOz1oFHyqC94lRxSiXT1EVzAr9Ldf53Q-zTtx3q_A8"
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
