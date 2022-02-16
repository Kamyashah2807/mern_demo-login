import React, { Component } from 'react';
import {
    Button, TextField, Dialog, DialogActions, LinearProgress,
    DialogTitle, DialogContent, TableBody, Table,
    TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import axios from 'axios';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Badge } from 'react-bootstrap';

export default class User extends Component {
    constructor() {
        super();
        this.state = {
            token: '',
            openIssueModal: false,
            openIssueEditModal: false,
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

    deleteIssue = (id) => {
        if (window.confirm("Are you sure wanted to delete?")) {
            axios.post('http://localhost:5000/api/test/user/deleteissue', {
                id: id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.state.accessToken
                }
            }).then((res) => {
                swal({
                    text: res.data.title,
                    icon: "success",
                    type: "success"
                });

                this.setState({ page: 1 }, () => {
                    this.pageChange(null, 1);
                });
            }).catch((err) => {
                swal({
                    text: err.response.data.errorMessage,
                    icon: "error",
                    type: "error"
                });
            });
        }
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

    handleInput = (e, editor) => {
        const data = editor.getData();
        this.setState({ description: data });
    }

    addIssue = () => {
        const fileInput = document.querySelector("#fileInput");
        const file = new FormData();
        file.append('file', fileInput.files[0]);
        file.append('title', this.state.title);
        file.append('description', this.state.description);
        file.append('status', this.state.status);

        axios.post('http://localhost:5000/api/test/user/addissue', file, {
            headers: {
                'content-type': 'multipart/form-data',
                'token': this.state.token
            }
        }).then((res) => {

            swal({
                text: res.data.title,
                icon: "success",
                type: "success"
            });

            this.handleIssueClose();
            this.setState({ title: '', description: '', status: '', file: null, page: 1 }, () => {
                this.getIssue();
            });
        }).catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.handleIssueClose();
        });
    }

    updateIssue = () => {
        const fileInput = document.querySelector("#fileInput");
        const file = new FormData();
        file.append('id', this.state.id);
        file.append('file', fileInput.files[0]);
        file.append('title', this.state.title);
        file.append('description', this.state.description);
        file.append('status', this.state.status);

        axios.post('http://localhost:5000/api/test/user/updateissue', file, {
            headers: {
                'content-type': 'multipart/form-data',
                'token': this.state.accessToken
            }
        }).then((res) => {
            swal({
                text: res.data.title,
                icon: "success",
                type: "success"
            });

            this.handleIssueEditClose();
            this.setState({ title: '', description: '', status: '', file: null }, () => {
                this.getIssue();
            });
        }).catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.handleIssueEditClose();
        });
    }

    handleIssueOpen = () => {
        this.setState({
            openIssueModal: true,
            id: '',
            title: '',
            description: '',
            status: '',
            fileName: ''
        });
    };

    handleIssueClose = () => {
        this.setState({ openIssueModal: false });
    };

    handleIssueEditOpen = (data) => {
        this.setState({
            openIssueEditModal: true,
            id: data._id,
            title: data.title,
            description: data.description,
            status: data.status,
            fileName: data.image
        });
    };

    handleIssueEditClose = () => {
        this.setState({ openIssueEditModal: false });
    };

    render() {
        return (
            <div style={{ textAlign: "center" }}>
                {this.state.loading && <LinearProgress size={40} />}
                <div>
                    <h2>Dashboard</h2>
                    <Button
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={this.handleIssueOpen}
                    >
                        Add Issue
                    </Button>
                </div>

                <Dialog
                    open={this.state.openIssueEditModal}
                    onClose={this.handleIssueClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Edit Issue</DialogTitle>
                    <DialogContent>
                        <div className='form-group'>
                            <label className='form-label'>Title</label>
                            <input
                                type="text"
                                className='form-control'
                                placeholder='Enter Title'
                                value={this.state.title}
                                name="title"
                                onChange={this.onChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>File</label>
                            <input
                                className='form-control'
                                id="standard-basic"
                                type="file"
                                accept="image/*"
                                name="file"
                                value={this.state.file}
                                onChange={this.onChange}
                                id="fileInput"
                                placeholder="File"
                            />
                            {this.state.fileName}
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>Description</label>
                            <CKEditor editor={ClassicEditor}
                                onChange={this.handleInput}
                                data={this.state.description || ""}
                            />
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>Status</label>
                            <select
                                className='form-select'
                                onChange={this.onChange}
                                value={this.state.status}
                                name="status"
                            >
                                <option value>--Select--</option>
                                <option value="Open">Open</option>
                                <option value="Processing">Processing</option>
                                <option value="In Review">In Review</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleIssueEditClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            disabled={this.state.title === '' || this.state.description === '' || this.state.status === ''}
                            onClick={(e) => this.updateIssue()} color="primary" autoFocus>
                            Edit Issue
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.openIssueModal}
                    onClose={this.handleIssueClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Add Issue</DialogTitle>
                    <DialogContent>
                        <div className='form-group'>
                            <label className='form-label'>Title</label>
                            <input
                                type="text"
                                className='form-control'
                                placeholder='Enter Title'
                                value={this.state.title}
                                name="title"
                                onChange={this.onChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>File</label>
                            <input
                                className='form-control'
                                id="standard-basic"
                                type="file"
                                accept="image/*"
                                name="file"
                                value={this.state.file}
                                onChange={this.onChange}
                                id="fileInput"
                                placeholder="File"
                            />
                            {this.state.fileName}
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>Description</label>
                            <CKEditor editor={ClassicEditor}
                                onChange={this.handleInput}
                                data={this.state.description || ""}
                            />
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>Status</label>
                            <select
                                className='form-select'
                                onChange={this.onChange}
                                value={this.state.status}
                                name="status"
                            >
                                <option value>--Select--</option>
                                <option value="Open">Open</option>
                                <option value="Processing">Processing</option>
                                <option value="In Review">In Review</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleIssueClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            disabled={this.state.title === '' || this.state.description === '' || this.state.status === '' || this.state.file === null}
                            onClick={(e) => this.addIssue()} color="primary" autoFocus>
                            Add Issue
                        </Button>
                    </DialogActions>
                </Dialog>

                <br />

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
                                <TableCell align="center">Action</TableCell>
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
                                    <TableCell align="center">
                                        <Button
                                            className="button_style"
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={(e) => this.handleIssueEditOpen(row)}
                                        >
                                            Edit
                                        </Button> &nbsp;
                                        <Button
                                            className="button_style"
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            onClick={(e) => this.deleteIssue(row._id)}
                                        >
                                            Delete
                                        </Button>
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