import React, { Component } from 'react';
import {
  Button, TextField, LinearProgress, TableBody, Table, TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import axios from 'axios';
import { Badge } from 'react-bootstrap';

export default class Admin extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      id: '',
      title: '',
      description: '',
      status: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      issues: [],
      pages: 0,
      loading: false,
    };
  }

  getIssue = () => {
    this.setState({ loading: true });
    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:5000/api/test/user/getissue${data}`)
      .then((res) => {
        this.setState({ loading: false, issues: res.data.issues, pages: res.data.pages });
      }).catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
        this.setState({ loading: false, issues: [], pages: 0 }, () => { });
      });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getIssue();
    });
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name === 'search') {
      this.setState({ page: 1 }, () => {
        this.getIssue();
      });
    }
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Dashboard</h2>
        </div>

        <TableContainer>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Search by Title"
            required
          />
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.issues.map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="center" component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="center"><img src={`http://localhost:5000/${row.image}`} width="70" height="70" /></TableCell>
                  <TableCell align="center"><div dangerouslySetInnerHTML={{ __html: row.description }} /></TableCell>
                  <TableCell align="center">
                    {row.status === "Open" ? <Badge bg="primary">{row.status}</Badge> : null}
                    {row.status === "Processing" ? <Badge bg="info">{row.status}</Badge> : null}
                    {row.status === "In Review" ? <Badge bg="warning">{row.status}</Badge> : null}
                    {row.status === "Completed" ? <Badge bg="success">{row.status}</Badge> : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>
      </div>
    );
  }
}