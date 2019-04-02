type IDots = Array<{
  img: string
  dotId: string
  status: number
}>

interface TaskItemInterface {
  taskId: string
  dots: IDots
  progress: number
  submitted: boolean
  submitting: boolean
}

interface TaskStateInterface {
  tasks: TaskItemInterface[]
}

interface ChangeStatusArgsInterface {
  taskId: string
  dotId: string
  status: number
}

interface SubmitOneTaskInterface {
  taskId: string
}
