import React from "react";
import "./App.css";
import {
  Container,
  Row,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Alert,
  Table
} from "react-bootstrap";
import Upload from './components/upload'
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: "",
      cpf: "",
      records: [],
      showAlert: false,
      alertMsg: "",
      alertType: "sucess",
    };
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };
  
  componentWillMount() {
    this.fetchAllRecord();
  }

  // add a record
  addRecord = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var body = JSON.stringify({ nome: this.state.nome, cpf: this.state.cpf});
    fetch("http://localhost:3001/api/create", {
      method: "POST",
      headers: myHeaders,
      body: body,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          id: "",
          nome: "",
          cpf: "",
          showAlert: true,
          alertMsg: result.response,
          alertType: "sucess",
          update: false,
        });
        this.fetchAllRecord();
      });
  };

  // fetch all Records
  fetchAllRecord = () => {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch("http://localhost:3001/api/view", {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("result", result);
        this.setState({
          records: result.response,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  //view sigle data to edit
  editRecord = (id) => {
    fetch("http://localhost:3001/api/view/" + id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          id: id,
          update: true,
          nome: result.response[0].nome,
          cpf: result.response[0].cpf,
        });
      })
      .catch((error) => console.log("error", error));
  };

  // update record
  updateRecord = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var body = JSON.stringify({
      id: this.state.id,
      nome: this.state.nome,
      cpf: this.state.cpf,
    });
    fetch("http://localhost:3001/api/update/", {
      method: "PUT",
      headers: myHeaders,
      body: body,
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          showAlert: true,
          alertMsg: result.response,
          alertType: "sucess",
          update: false,
          id: "",
          nome: "",
          cpf: "",
        });
        this.fetchAllRecord();
      })
      .catch((error) => console.log("error", error));
  };

  //delete record
  deleteRecord = (id) => {
    fetch("http://localhost:3001/api/delete/" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          showAlert: true,
          alertMsg: result.response,
          alertType: "danger",
        });
        this.fetchAllRecord();
      })
      .catch((error) => console.log("error", error));
  };

  render() {
    return (
      <div className="App">
        <Container className="wrapper fadeinDown">
          {this.state.showAlert === true ? (
            <Alert
              variant={this.state.alertType}
              onClose={() => {
                this.setState({
                  showAlert: false,
                });
              }}
              dismissible
            >
              <Alert.Heading>{this.state.alertMsg}</Alert.Heading>
            </Alert>
          ) : null}
          {/* Insert Form */}
          <Row>
            <Form className="formContent" enctype="multipart/form-data" action="http://localhost:3001/api/create" method="POST">
              <h2 className="h2 fadeIn first">Cadastro de Clientes</h2>
              {/* <FormGroup className="fadeIn first">
                <FormLabel className="formlabel">ID</FormLabel>
                <FormControl type="text" name="id" placeholder="Insira o ID" onChange={this.handleChange} value={this.state.id} />
              </FormGroup> */}

              <FormGroup className="fadeIn second">
                <FormLabel className="formlabel">Nome</FormLabel>
                <FormControl
                  type="text"
                  name="nome"
                  placeholder="Insira o Nome"
                  onChange={this.handleChange}
                  value={this.state.nome}
                />
              </FormGroup>

              <FormGroup className="fadeIn second" id="lastform">
                <FormLabel className="formlabel">CPF</FormLabel>
                <FormControl
                  type="text"
                  name="cpf"
                  placeholder="Insira o CPF"
                  onChange={this.handleChange}
                  value={this.state.cpf}
                />
              </FormGroup>
              
              <input type="file" id="imagem_clientes" name="imagem_clientes" />

              {/* <Upload /> */}
              {this.state.update === true ? (
                <Button className="button" onClick={this.updateRecord}>
                  Update
                </Button>
              ) : (
                <Button

                  className="button fadeIn fourth"
                  onClick={this.addRecord}
                >
                  Criar
                </Button>
              )}
            </Form>
          </Row>

          {/*  All records */}
          <Row>
            <div className="general fadeIn fourth">
              <Table hover striped responsive="sm" className="table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">NOME</th>
                    <th scope="col">CPF</th>
                    <th scope="col">FOTO</th>
                    <th scope="col">EDITAR</th>
                    <th scope="col">DELETAR</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.records.map((record) => {
                    return (
                      <tr key={record.id}>
                        <td>
                          <p className="p">{record.id}</p>
                        </td>
                        <td>
                          <p className="p">{record.nome}</p>
                        </td>
                        <td>
                          <p className="p">{record.cpf}</p>
                        </td>
                        <td>
                          <div className="divimg">
                            <a
                              href={
                                "http://localhost:3001/images" + record.imagem_cliente
                              }
                              target="_newblank"
                            >
                              <img
                                src={
                                  "http://localhost:3001/images/213.jpg"
                                }
                                alt="Imagem dos Clientes"
                              />
                            </a>
                          </div>
                        </td>
                        <td>
                          <a
                            href="#!"
                            onClick={() => this.editRecord(record.id)}
                          >
                            <EditIcon className="editicon">Editar</EditIcon>
                          </a>
                        </td>
                        <td>
                          <a
                            href="#!"
                            onClick={() => this.deleteRecord(record.id)}
                          >
                            <DeleteIcon className="deleteicon"></DeleteIcon>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div className="container text-center">
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
