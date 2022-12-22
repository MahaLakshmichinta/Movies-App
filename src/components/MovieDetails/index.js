import {Component} from 'react'
import Cookies from 'js-cookie'
import format from 'date-fns/format'
import Loader from 'react-loader-spinner'
import NavBar from '../NavBar'
import Footer from '../Footer'

import SimilarMovies from '../SimilarMovies'
import FailurePage from '../FailurePage'

import './index.css'

const renderConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  fail: 'FAIL',
  loading: 'LOADING',
}

class MovieDetails extends Component {
  state = {movieDetailsList: {}, renderStatus: renderConstraints.initial}

  componentDidMount() {
    this.getMovieDetails()
  }

  getMovieDetails = async () => {
    this.setState({renderStatus: renderConstraints.loading})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const movieDetailsApi = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(movieDetailsApi, options)

    if (response.ok) {
      const data = await response.json()
      const movieDetails = data.movie_details
      const formattedMovieDetails = {
        adult: movieDetails.adult,
        backdropPath: movieDetails.backdrop_path,
        budget: movieDetails.budget,
        genres: movieDetails.genres,
        id: movieDetails.id,
        overview: movieDetails.overview,
        posterPath: movieDetails.poster_path,
        releaseDate: movieDetails.release_date,
        runtime: movieDetails.runtime,
        similarMovies: movieDetails.similar_movies,
        spokenLanguages: movieDetails.spoken_languages,
        title: movieDetails.title,
        voteAverage: movieDetails.vote_average,
        voteCount: movieDetails.vote_count,
      }

      formattedMovieDetails.similarMovies = formattedMovieDetails.similarMovies.map(
        movie => ({
          backdropPath: movie.backdrop_path,
          id: movie.id,
          overview: movie.overview,
          posterPath: movie.poster_path,
          title: movie.title,
        }),
      )

      formattedMovieDetails.spokenLanguages = formattedMovieDetails.spokenLanguages.map(
        language => ({id: language.id, englishName: language.english_name}),
      )

      this.setState({
        movieDetailsList: formattedMovieDetails,
        renderStatus: renderConstraints.success,
      })
    } else {
      this.setState({renderStatus: renderConstraints.fail})
    }
  }

  tryAgainMoviesData = () => {
    this.getMovieDetails()
  }

  renderLoaderView = () => (
    <>
      <NavBar />
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <NavBar />
      <FailurePage tryAgain={this.tryAgainMoviesData} />
    </>
  )

  renderSuccessView = () => {
    const {movieDetailsList} = this.state

    const {
      adult,
      backdropPath,
      budget,
      genres,
      overview,
      releaseDate,
      runtime,
      similarMovies,
      spokenLanguages,
      title,
      voteAverage,
      voteCount,
    } = movieDetailsList
    const inHours = Math.floor(runtime / 60)
    const inMinutes = runtime % 60
    const runTimeInHoursAndMinutes = `${inHours}h ${inMinutes}m`
    const certificateName = adult ? 'A' : 'U/A'
    const releaseYear = format(new Date(releaseDate), 'yyyy')
    const releaseDateFormat = format(new Date(releaseDate), 'do MMMM yyyy')
    return (
      <>
        <div
          style={{backgroundImage: `url(${backdropPath})`}}
          className="movie-detail-page"
        >
          <NavBar />
          <div className="movie-detail-movie-page">
            <h1 className="title">{title}</h1>
            <div className="more-details">
              <p className="duration">{runTimeInHoursAndMinutes}</p>
              <p className="certificate">{certificateName}</p>
              <p className="release-year">{releaseYear}</p>
            </div>
            <p className="over-view">{overview}</p>
            <button type="button" className="play-btn">
              Play
            </button>
          </div>
        </div>
        <div className="additional-information">
          <div className="movie-info">
            <div className="info">
              <h1 className="info-heading">Genres</h1>
              <ul className="list-items">
                {genres.map(genre => (
                  <p key={genre.id}>{genre.name}</p>
                ))}
              </ul>
            </div>
            <div className="info">
              <h1 className="info-heading">Audio Available</h1>
              <ul className="list-items">
                {spokenLanguages.map(language => (
                  <p key={language.id}>{language.englishName}</p>
                ))}
              </ul>
            </div>
            <div className="info">
              <h1 className="info-heading">Rating Count</h1>
              <p className="items">{voteCount}</p>
              <h1 className="info-heading">Rating Average</h1>
              <p className="items">{voteAverage}</p>
            </div>
            <div className="info info1">
              <h1 className="info-heading">Budget</h1>
              <p className="items">{budget}</p>
              <h1 className="info-heading">Release Date</h1>
              <p className="items">{releaseDateFormat}</p>
            </div>
          </div>
          <div className="similar-movies-container">
            <h1 className="more-like-this-text">More like this</h1>
            <div className="similar-movies-list">
              {similarMovies.map(eachMovie => (
                <SimilarMovies eachMovie={eachMovie} key={eachMovie.id} />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  renderSwitchView = () => {
    const {renderStatus} = this.state
    switch (renderStatus) {
      case renderConstraints.loading:
        return this.renderLoaderView()
      case renderConstraints.success:
        return this.renderSuccessView()
      case renderConstraints.fail:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="movie-details-container">{this.renderSwitchView()}</div>
    )
  }
}

export default MovieDetails
