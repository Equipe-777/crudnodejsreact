import React from "react";
import "./App.css";
import {
  Container,
  Row,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  FormFile,
  Button,
  Alert,
  Table,
} from "react-bootstrap";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { cpfMask } from "./components/cpfMask.js";

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
      cpf: cpfMask(evt.target.value),
    });
  };

  componentDidMount() {
    this.fetchAllRecord();
  }
  // fetch all Records
  fetchAllRecord = () => {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch("http://localhost:3002/clientes/", {
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

  // -> Mudei o método de adicionar para um form/data, por isso não precisa mais do fetch com os setState

  // // add a record
  // addRecord = () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "multipart/form-data; boundary=something");
  //   const imagem_cliente = document.getElementById("imagem_cliente").files[0];
  //   var body = JSON.stringify({ nome: this.state.nome, cpf: this.state.cpf });
  //   fetch("http://localhost:3002/clientes/", {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: body + `${imagem_cliente}`,
  //   })
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);
  //       this.setState({
  //         id: "",
  //         nome: "",
  //         cpf: "",
  //         showAlert: true,
  //         alertMsg: result.response,
  //         alertType: "sucess",
  //         update: false,
  //       });
  //       this.fetchAllRecord();
  //     });
  // };

  //    tentativa de submit do form com atualização do map (fetch com metodo get)
  // sem ter que clicar no botão read e fazer a requisição get. -> fail
  // acaba que a função fetchAllRecord é iniciada antes da validação do submit, não retornando
  // o registro certo

  // submitbutton = () => {
  //   let button = document.getElementById("create-btn");
  //   let input = document.getElementById("nome");
  //   let cpf = document.getElementById("cpf");
  //   let img = document.getElementById("imagem_cliente");
  //   if (
  //     input.checkValidity() &&
  //     cpf.checkValidity() &&
  //     img.checkValidity() === true
  //   ) {
  //     button.form.submit();
        //<p> do código ganha classe fadeout (usar como msg de insert)
  //   }
  //   // else { alert("Preencha todos os campos!"); }
  //   this.fetchAllRecord();
  // };

  //view sigle data to edit
  editRecord = (id) => {
    fetch("http://localhost:3002/clientes/" + id, {
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
          imagem_cliente: result.response[0].imagem_cliente,
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

    fetch("http://localhost:3002/clientes/", {
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
    var confirm = window.confirm(
      "Tem certeza que deseja apagar esse registro?"
    );
    if (confirm === true) {
      fetch("http://localhost:3002/clientes/" + id, {
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
    }
  };

  //delete all records
  deleteRecords = () => {
    var confirm = window.prompt(
      'Tem certeza que deseja apagar todos os registros? Digite "SIM" para confirmar'
    );
    if (confirm === "SIM" || confirm === "Sim" || confirm === "sim") {
      fetch("http://localhost:3002/clientes/", {
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
    }
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
            <Form
              className="formContent"
              encType="multipart/form-data"
              action="http://localhost:3002/clientes/"
              method="POST"
              id="form"
            >
              <h2 className="h2 fadeIn first">Cadastro de Clientes</h2>
              {/* <FormGroup className="fadeIn first">
                <FormLabel className="formlabel">ID</FormLabel>
                <FormControl type="text" name="id" placeholder="Insira o ID" onChange={this.handleChange} value={this.state.id} />
              </FormGroup> */}

              <FormGroup className="fadeIn second">
                <FormLabel className="formlabel">Nome</FormLabel>
                <FormControl
                  required
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Insira o Nome"
                  onChange={this.handleChange}
                  value={this.state.nome}
                />
              </FormGroup>

              <FormGroup className="fadeIn second" id="lastform">
                <FormLabel className="formlabel">CPF</FormLabel>
                <FormControl
                  required
                  minlength="14"
                  type="text"
                  id="cpf"
                  name="cpf"
                  placeholder="Insira o CPF"
                  onChange={this.handleChange}
                  value={this.state.cpf}
                  oninvalid="this.InvalidMsg(this)"
                />
              </FormGroup>
              {/* <input
                required
                type="file"
                className="fadeIn fourth"
                id="imagem_cliente"
                name="imagem_cliente"
              /> */}

              <FormGroup controlId="formFileSm" className="">
                <FormFile
                  required
                  accept="image/*"
                  type="file"
                  className="fadeIn fourth"
                  id="imagem_cliente"
                  name="imagem_cliente"
                />
              </FormGroup>

              <div>
                <Button
                  className="button fadeIn fourth"
                  id="edit-btn"
                  onClick={this.fetchAllRecord}
                >
                  Read
                </Button>
                {this.state.update === true ? (
                  <Button className="button" onClick={this.updateRecord}>
                    Update
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={this.submitbutton}
                    className="button fadeIn fourth"
                    id="create-btn"
                  >
                    Create
                  </Button>
                )}
                <Button
                  className="button fadeIn fourth"
                  id="delete-btn"
                  onClick={this.deleteRecords}
                >
                  Delete all
                </Button>
              </div>
            </Form>
          </Row>
          {/*  All records */}
          <Row>
            <div className="general fadeIn fourth">
              <Table hover size="sm" striped responsive className="table">
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
                                "http://localhost:3002/" + record.imagem_cliente
                              }
                              target="_newblank"
                            >
                              <img
                                src={
                                  "http://localhost:3002/" +
                                  record.imagem_cliente
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
            <div className="container text-center"></div>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
