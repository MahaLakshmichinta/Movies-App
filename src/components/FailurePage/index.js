import {withRouter} from 'react-router-dom'

const FailurePage = props => {
  const {match, tryAgain} = props
  const {path} = match
  const imgUrl =
    path === '/'
      ? 'https://res.cloudinary.com/dfnwpgiwt/image/upload/v1667981498/alert-triangle_kqzqxn.png'
      : 'https://res.cloudinary.com/dfnwpgiwt/image/upload/v1667981610/Background-Complete_rtynpj.png'
  const onTryAgain = () => {
    tryAgain()
  }
  return (
    <div className="failure-view">
      <img src={imgUrl} alt="failure view" className="failure-img" />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button type="button" onClick={onTryAgain} className="retry-btn">
        Try Again
      </button>
    </div>
  )
}

export default withRouter(FailurePage)
