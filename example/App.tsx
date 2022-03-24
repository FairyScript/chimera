import { Button, Popover } from '../src'
const App: React.FC = () => {
  return (
    <div>
      <Popover content="Hello World">

        <Button>Click me</Button>
      </Popover>
    </div>
  )
}

export default App
