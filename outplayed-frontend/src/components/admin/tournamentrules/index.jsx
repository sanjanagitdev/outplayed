import React, { useState, useEffect } from "react";
import { Form, Button, Table } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification, TournamentRuleValidation } from '../../../function';
import AdminWrapper from "../adminwrapper/wrapper";


const TournamentRules = () => {
    const initialValue = { id: '', popUp: false }
    const [tournamentRule, setTournamentRule] = useState('');
    const [rulesList, setRulesList] = useState([]);
    const [forUpdate, setForUpdate] = useState(initialValue);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        RulesList();
    }, []);

    const AddRules = async (e) => {
        try {
            e.preventDefault();
            const { isValid, errors } = TournamentRuleValidation({ tournamentRule });
            if (!isValid) {
                setErrors(errors)
                return;
            }
            const response = await adminInstance().post('/add-tournament-rules', { tournamentRule });
            const { data: { code, msg, savedData } } = response;
            if (code === 200) {
                setRulesList(preState => [savedData].concat(...preState));
                Notification('success', msg);
                setTournamentRule('');
                setErrors({});
            } else {
                Notification('danger', msg);
            }

        } catch (error) {
            return error;
        }
    }

    const RulesList = async () => {
        try {
            const response = await adminInstance().get('/tournament-rules');
            const { data: { code, rules } } = response;
            if (code === 200) {
                setRulesList(rules);
            }
        } catch (error) {
            return error;
        }
    }
    const DeleteRules = async (id) => {
        try {
            const response = await adminInstance().delete(`/delete-tournament-rules/${id}`);
            const { data: { code, msg } } = response;
            if (code === 200) {
                setRulesList(preState => preState.filter(el => el._id !== id));
                Notification('success', msg);
            } else {
                Notification('danger', msg);
            }
        } catch (error) {
            return error;
        }
    }

    //update-tournament-rules

    const UpdateRules = async (e) => {
        try {
            e.preventDefault();
            const { isValid, errors } = TournamentRuleValidation({ tournamentRule });
            if (!isValid) {
                setErrors(errors)
                return;
            }
            const { id } = forUpdate;
            const response = await adminInstance().patch(`/update-tournament-rules/${id}`, { tournamentRule });
            const { data: { code, msg } } = response;
            if (code === 200) {
                Notification('success', msg);
                setErrors({});
                RulesList();
                setForUpdate(initialValue);
            } else {
                Notification('danger', msg);
            }

        } catch (error) {
            return error;
        }
    }

    const HandleSelectRule = (id, rule, open) => {
        setForUpdate({ ...forUpdate, id: open === 'open' ? id : '', popUp: open === 'open' ? true : false });
        setTournamentRule(open === 'open' ? rule : '');
        setErrors({})
    }
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>{forUpdate.popUp ? 'Update' : 'Add'} Tournament rules</h2>
                            <Form onSubmit={forUpdate.popUp ? UpdateRules : AddRules}>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>{forUpdate.popUp ? 'Update' : 'Add'} RULES</Form.Label>
                                    <Form.Control as="textarea" value={tournamentRule} rows={6} onChange={(e) => setTournamentRule(e.target.value)} />
                                    {errors.rule && <Form.Text className="text-danger">
                                        {errors.rule}
                                    </Form.Text>}
                                </Form.Group>
                                <div className="">
                                    <div className="login-button">
                                        <Button type="submit" className="l-btn" >
                                            {forUpdate.popUp ? 'Update' : 'Add'} rules
                                    </Button>
                                        {forUpdate.popUp && <Button onClick={() => HandleSelectRule('', '', 'close')} className="l-btn btn-danger" >
                                            Cancel
                                    </Button>}
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>S.N</th>
                                    <th>Rules</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rulesList && rulesList.map((el, i) => {
                                    return <RulesLists element={el} index={i} DeleteRules={DeleteRules} HandleSelectRule={HandleSelectRule} />
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    );
};
export default TournamentRules;

const RulesLists = ({ element, index, DeleteRules, HandleSelectRule }) => {
    const { tournamentRule, _id } = element;
    return (
        <tr key={index}>
            {<td>{index + 1}</td>}
            <td>{tournamentRule}</td>
            <td>
                <div className="action-buttons">
                    <Button className="block-btn" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to delete this tournament rule?'
                            )
                        ) {
                            DeleteRules(_id);
                        }
                    }}><i className="fa fa-trash-o" aria-hidden="true"></i></Button>
                    <Button onClick={() => HandleSelectRule(_id, tournamentRule, 'open')} className="approve-btn"><i className="fa fa-eye" aria-hidden="true"></i></Button>
                </div>
            </td>
        </tr>
    )
}
