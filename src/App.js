import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Popover, PopoverBody, Card, Container, Row, Col, CardImg, CardText, CardBody, CardTitle, Button, Nav, NavItem, NavLink  } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'



class App extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleClickLikeOff = this.handleClickLikeOff.bind(this);
    this.handleClickLikeOn = this.handleClickLikeOn.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
      viewOnlyLike: false,
      moviesCount:0,
      moviesNameList:[],
      movies:[]
    };
  }

  componentDidMount(){

      var ctx = this;

      fetch('http://localhost:3000/movie')

      .then(function(data) {
        return data.json();
      })

      .then(function(data) {
          console.log(data);
           ctx.setState({movies:data.results});
      })
      .catch(function(error) {
        console.log('Request failed', error)
      });
    }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  handleClickLikeOff() {
    this.setState({viewOnlyLike: false});
  }

  handleClickLikeOn() {
    this.setState({viewOnlyLike: true});

  }

  handleClick(isLike, name) {
    console.log(isLike);
    var moviesNameListCopy = [...this.state.moviesNameList];

    if (isLike == true) {
      moviesNameListCopy.push(name);
      this.setState({
        moviesCount: this.state.moviesCount+1,
        moviesNameList: moviesNameListCopy
      })
    }else{
        var index = moviesNameListCopy.indexOf(name);
        moviesNameListCopy.splice(index,1);
        this.setState({
          moviesCount: this.state.moviesCount-1,
          moviesNameList: moviesNameListCopy
        })
      }
    }


  render() {

    var data=[...this.state.movies];

    var ctx = this;

    var data = data.map(function(data,i) {
        return (<Movie key={i} handleClickParent={ctx.handleClick} displayOnlyLike={ctx.state.viewOnlyLike} movieName={data.title} movieImage={"http://image.tmdb.org/t/p/w92//"+data.poster_path} movieDesc={data.overview.substr(0,150)}  idMovie={data.id}/>);
      });
    // }
    var lastName = "";

    var moviesNameListCopy = [...this.state.moviesNameList];

    if (moviesNameListCopy.length > 0) {
      lastName = moviesNameListCopy.pop();
    }
    if (moviesNameListCopy.length > 0) {
      lastName = lastName + ', ' + moviesNameListCopy.pop();
    }
    if (moviesNameListCopy.length > 0) {
      lastName = lastName + ', ' + moviesNameListCopy.pop();
    }
    if (moviesNameListCopy.length > 0) {
      lastName = lastName + '...';
    }

    return (<Container className="col-12" style={{
        paddingRight: '300px',
        paddingLeft: '300px'
      }}>

      <Row style={{
          marginBottom: '15px'
        }}>
        <Col>
          <Nav>
            <NavItem>
              <NavLink href="#"><img src="./logo.png" alt="logo"/></NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={this.handleClickLikeOff} href="#">
                Last releases</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={this.handleClickLikeOn} style={{
                }} href="#">My movies</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">
                <Button id="Popover1" onClick={this.toggle}>
                  {this.state.moviesCount}
                  Movie
                </Button>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
                  <PopoverBody>{lastName}</PopoverBody>
                </Popover>
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>

      <Row>
        {data}
      </Row>

    </Container>)
  }
}

class Movie extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      like: false,
      moviesLiked:[]
    };
  }



  handleClick() {
    console.log("like")
    var isLike = !this.state.like;
    var movieName = this.props.movieName;
    this.setState({
        like: isLike
      });
      this.props.handleClickParent(isLike, movieName);
    }

  render() {
      var colorHeart;
      if (this.state.like === true) {
        colorHeart = {
          color: "#FF5B53",
          cursor: "Pointer",
          idMovieDB:""
        }

        fetch('http://localhost:3000/mymovies',
          {
            method:"post",
            headers: {"Content-Type":"application/x-www-form-urlencoded"},
            body:"title="+this.props.movieName+"&overview="+this.props.movieDesc+"&poster_path="+this.props.movieImage+"&idMovieDB="+this.props.idMovie
          });
        }else {
              fetch('http://localhost:3000/mymovies/'+this.props.idMovie,
              {method:"delete"});
              }



      var isDisplay;
      if (this.props.displayOnlyLike == true && this.state.like == false) {

        isDisplay = {
          display: "none"
        }
      }

    return (<Col xs="3" style={isDisplay}>
      <Card style={{
          marginBottom: '15px'
        }}>
        <CardImg top width="100%" src={this.props.movieImage} alt="Card image cap"/>
        <CardBody>
          <FontAwesomeIcon style={colorHeart} onClick={this.handleClick} icon={faHeart}/>
          <CardTitle>{this.props.movieName}</CardTitle>
          <CardText>{this.props.movieDesc}</CardText>
        </CardBody>
      </Card>
    </Col>);

  }
}

export default App;
