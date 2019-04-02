import { Button, Progress, Spin, Tooltip } from 'antd'
import React from 'react'
import styled, { css } from 'styled-components'
import { v1 as uuid } from 'uuid'

// <editor-fold desc="工具函数">
const submitOneTask = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}

const waitForTaskHide = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}

const getDotItem = (img: string) => ({
  dotId: uuid(),
  img,
  status: -1,
})

const getDots = () =>
  [...Array(Math.ceil(Math.random() * 4))].map(() =>
    getDotItem(
      'http://cn-beijing-gaode.oss-internal.aliyun-inc.com/zlk/zlkoss/gj_qj/20180601/b838dbf757f044b8a81b3ea6b1a1d057/18Q2_new/changsha/changsha-ADAS-20180522-AD7G62/H49F044040/Ladybug_20180522_100123_27254_C0.jpg',
    ),
  )

const getNewTask = (): Promise<TaskItemInterface> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        dots: getDots(),
        progress: 0,
        submitted: false,
        submitting: false,
        taskId: uuid(),
      })
    }, 500)
  })

// </editor-fold>

// <editor-fold desc="styled Task">
const TaskMod = styled.div`
  padding: 0 20px;
  width: 100vw;
`

const TaskModTrans = styled.div<{ submitted: number }>`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  max-height: 1000px;
  transition: all 800ms;
  overflow: hidden;

  ${({ submitted }) =>
    submitted === 1
      ? css`
          max-height: 0;
        `
      : ''}
`

const TaskWrap = styled.div`
  display: flex;
  flex-flow: row wrap;
`

const Dot = styled.div`
  width: 300px;
  height: var(--dot-height);
  display: flex;
  flex-flow: column nowrap;
  position: relative;
`

const DotStatus = styled.i<{ status: number }>`
  position: absolute;
  right: 10px;
  bottom: calc(var(--edit-btn-height) + 10px);
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background: #eee no-repeat center center;
  background-size: 100% 100%;

  ${({ status }) =>
    status === 1
      ? css`
          background-image: url(../../public/imgs/snail/edit-status/invalid.png);
        `
      : status === 2
      ? css`
          background-image: url(../../public/imgs/snail/edit-status/correct.png);
          background-size: 80% 80%;
        `
      : status === 3
      ? css`
          background-image: url(../../public/imgs/snail/edit-status/unknown.png);
        `
      : ''}
`

const TaskImgWrap = styled.div`
  width: 100%;
  height: calc(var(--dot-height) - var(--edit-btn-height));
`

const TaskImg = styled.img`
  width: 100%;
  height: 100%;
`

const TaskBtnWrap = styled.div`
  width: 100%;
  display: flex;
`

const TaskBtn = styled.button`
  flex-basis: 30%;
  flex-grow: 1;
  border: none;
  outline: none;
  color: #fff;

  &:active {
    opacity: 0.5;
  }
`

const TaskBtn1 = styled(TaskBtn)`
  background: #e39995;
`

const TaskBtn2 = styled(TaskBtn)`
  background: #88b984;
`

const TaskBtn3 = styled(TaskBtn)`
  background: #98b3ef;
`

const ProgressWrap = styled.div`
  padding-top: 30px;
  display: flex;
`

const MyProgress = styled(Progress)`
  flex: 1 0;
`

const SubmitBtn = styled(Button)<{ hide?: number }>`
  &.ant-btn {
    width: 70px;
    transition: all 0.5s;
    overflow: hidden;

    ${({ hide }) =>
      hide === 1
        ? css`
            width: 0;
            padding: 0;
            border: none;
          `
        : ''}
  }
`

const SubmitConfirmBtn = styled(Button)`
  &.ant-btn {
    background-color: transparent;
    color: #fff;
  }
`

class Task extends React.Component<{
  taskId: string
  dots: IDots
  progress: number
  submitted: boolean
  submitting: boolean
  onChangeStatus: (arg: ChangeStatusArgsInterface) => void
  onSubmitOneTask: (arg: SubmitOneTaskInterface) => void
}> {
  public render() {
    const {
      taskId,
      dots,
      progress,
      onChangeStatus,
      onSubmitOneTask,
      submitted,
      submitting,
    } = this.props
    return (
      <Spin spinning={submitting}>
        <TaskMod>
          <TaskModTrans submitted={submitted ? 1 : 0}>
            <ProgressWrap>
              <MyProgress percent={progress} />
              <Tooltip
                title={
                  <div>
                    <SubmitConfirmBtn
                      onClick={() => {
                        onSubmitOneTask({ taskId })
                      }}
                    >
                      确认提交
                    </SubmitConfirmBtn>
                  </div>
                }
              >
                <SubmitBtn type="primary" hide={progress < 100 ? 1 : 0}>
                  提交
                </SubmitBtn>
              </Tooltip>
            </ProgressWrap>
            <TaskWrap>
              {dots.map(({ img, dotId, status }) => (
                <Dot key={dotId}>
                  <TaskImgWrap>
                    <TaskImg src={img} alt="任务图片" />
                  </TaskImgWrap>
                  <TaskBtnWrap>
                    <TaskBtn1
                      onClick={() => {
                        onChangeStatus({ taskId, dotId, status: 1 })
                      }}
                    >
                      无效
                    </TaskBtn1>
                    <TaskBtn2
                      onClick={() => {
                        onChangeStatus({ taskId, dotId, status: 2 })
                      }}
                    >
                      核实
                    </TaskBtn2>
                    <TaskBtn3
                      onClick={() => {
                        onChangeStatus({ taskId, dotId, status: 3 })
                      }}
                    >
                      待确认
                    </TaskBtn3>
                  </TaskBtnWrap>
                  <DotStatus status={status} />
                </Dot>
              ))}
            </TaskWrap>
          </TaskModTrans>
        </TaskMod>
      </Spin>
    )
  }
}
// </editor-fold>

export default class Snail extends React.Component<{}, TaskStateInterface> {
  public constructor(props: {}) {
    super(props)
    this.state = {
      tasks: [...Array(Math.ceil(Math.random() * 20))].map(() => ({
        dots: getDots(),
        progress: 0,
        submitted: false,
        submitting: false,
        taskId: uuid(),
      })),
    }
  }

  public componentDidMount(): void {
    document.addEventListener(
      'keydown',
      (e) => {
        const { keyCode } = e

        // 空格
        if (keyCode === 32) {
          e.preventDefault()
          this.state.tasks
            .filter(
              ({ progress, submitting }) => progress >= 100 && !submitting,
            )
            .forEach(async ({ taskId }) => {
              await this.handleSubmitOneTask({ taskId })
            })
        }
      },
      true,
    )
  }

  public handleChangeStatus = ({
    taskId,
    dotId,
    status,
  }: ChangeStatusArgsInterface) => {
    const taskIndex = this.state.tasks.findIndex(
      ({ taskId: taskIdInState }) => taskIdInState === taskId,
    )
    const task = this.state.tasks[taskIndex]
    if (task.submitting) {
      return
    }
    const dotIndex = task.dots.findIndex(
      ({ dotId: dotIdInState }) => dotIdInState === dotId,
    )
    const dot = task.dots[dotIndex]
    const nextDot = {
      ...dot,
      status,
    }
    const nextTasks = [...this.state.tasks]
    const nextDots = [...task.dots]
    nextDots.splice(dotIndex, 1, nextDot)
    nextTasks.splice(taskIndex, 1, {
      ...task,
      dots: nextDots,
      progress:
        (nextDots.filter(({ status: st }) => st !== -1).length /
          nextDots.length) *
        100,
    })
    this.setState({
      tasks: nextTasks,
    })
  }

  public handleSubmitOneTask = async ({ taskId }: SubmitOneTaskInterface) => {
    let taskIndex = this.state.tasks.findIndex(
      ({ taskId: taskIdInState }) => taskIdInState === taskId,
    )
    if (taskIndex === -1) {
      return
    }
    const task = this.state.tasks[taskIndex]
    let nextTasks = [...this.state.tasks]
    nextTasks.splice(taskIndex, 1, {
      ...task,
      submitting: true,
    })
    this.setState({
      tasks: nextTasks,
    })
    await submitOneTask()
    taskIndex = this.state.tasks.findIndex(
      ({ taskId: taskIdInState }) => taskIdInState === taskId,
    )
    if (taskIndex === -1) {
      return
    }
    nextTasks = [...this.state.tasks]
    nextTasks.splice(taskIndex, 1, {
      ...task,
      submitted: true,
    })
    this.setState({
      tasks: nextTasks,
    })
    await waitForTaskHide()
    taskIndex = this.state.tasks.findIndex(
      ({ taskId: taskIdInState }) => taskIdInState === taskId,
    )
    if (taskIndex === -1) {
      return
    }
    nextTasks = [...this.state.tasks]
    nextTasks.splice(taskIndex, 1)
    this.setState({
      tasks: nextTasks,
    })
    const newTask = await getNewTask()
    nextTasks = [...this.state.tasks]
    nextTasks.unshift(newTask)
    this.setState({
      tasks: nextTasks,
    })
  }

  public render() {
    return (
      <div>
        {this.state.tasks.map(
          ({ taskId, dots, progress, submitted, submitting }) => (
            <Task
              key={taskId}
              taskId={taskId}
              dots={dots}
              progress={progress}
              submitted={submitted}
              submitting={submitting}
              onChangeStatus={({
                taskId: clickedTaskId,
                dotId,
                status,
              }: ChangeStatusArgsInterface) => {
                this.handleChangeStatus({
                  taskId: clickedTaskId,
                  dotId,
                  status,
                })
              }}
              onSubmitOneTask={async ({
                taskId: clickedTaskId,
              }: SubmitOneTaskInterface) => {
                await this.handleSubmitOneTask({ taskId: clickedTaskId })
              }}
            />
          ),
        )}
      </div>
    )
  }
}
