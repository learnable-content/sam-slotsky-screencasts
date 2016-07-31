import io from 'socket.io-client'

export function channel(subject) {
  return io(`:5000/${subject}`)
}

export default io.connect('http://localhost:5000')
