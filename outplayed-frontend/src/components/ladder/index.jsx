import React, { useState, useEffect,useContext } from 'react'
import Layout from '../layout/layout'
import LeftSidebar from '../sidebar/leftsidebar'
import RightSidebar from '../sidebar/rightsidebar'
import './ladder.css';
import LadderBox from './ladder-box';
import LadderHeader from "./ladderheader";
import history from "../../config/history";
import { ladderInstance } from '../../config/axios';
import CreateLadder from "./createladderform";
import { validateLadder, Notification } from '../../function';
import UserContext from '../../context/context';

const LadderPage = () => {
    // const [startDate, setStartDate] = useState(new Date());
    const initialState = { title: "", ladderStart: new Date(), playerNumbers: 0, gameType: "", ladderPrize: "", ladderType: "Normal", banner: "", ladderEndDate: new Date() };
    const { userDetails} = useContext(UserContext);
    const {isladders} = userDetails;

    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState(initialState);
    const [bannerimg, setBannerImg] = useState(null);
    const [loader, setIsLoader] = useState(false);
    const [ladders, setLadders] = useState([]);
    const [laddersCopy, setLaddersCopy] = useState([]);
    const [searchData, setSearch] = useState('');

    useEffect(() => {
        ListLadders();
    }, [])

    const handleClose = () => {
        setShow(!show);
    }

    const OnChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    }

    const selectLadderGameType = (name, value) => {
        setValues({ ...values, [name]: value });
    }

    const SelectDate = (key, value) => {
        setValues({ ...values, [key]: value });
    }
    const handleImageChange = (event) => {
        try {
            setValues({ ...values, banner: URL.createObjectURL(event.target.files[0]) });
            setBannerImg(event.target.files[0])
        } catch (error) {
            return error;
        }
    }

    const handleCreateLadder = async (e) => {
        try {
            e.preventDefault();
            const { isValid, errors } = validateLadder(values, bannerimg);
            if (!isValid) {
                console.log(errors);
                setErrors(errors);
                return;
            }
            const data = new FormData();
            data.append("file", bannerimg);
            setIsLoader(true);
            delete values.banner;
            const response = await ladderInstance().post("/createladder", data, {
                params: values
            });
            const { code, msg } = response.data;
            if (code === 200) {
                Notification("success", msg);
                setErrors({})
                setBannerImg(null);
                handleClose();
                setIsLoader(false);
                setValues(initialState);
                ListLadders();
            } else {
                Notification("danger", msg);
                setIsLoader(false)
            }
        } catch (error) {
            return error;
        }
    }

    const ListLadders = async () => {
        try {
            const response = await ladderInstance().get("/ladders/running");
            const { data: { code, ladders } } = response;
            if (code === 200) {
                setLadders(ladders);
                setLaddersCopy(ladders);
            }
        } catch (error) {
            return error;
        }
    }

    const SearchLadders = value => {
        try {
            const exp = new RegExp(value.toLowerCase());
            const filteredData = laddersCopy.filter(item =>
                exp.test(item.title.toLowerCase()) || exp.test(item.gameType.toLowerCase()) || exp.test(item.ladderType.toLowerCase())
            );
            setLadders(filteredData);
            setSearch(value);
        } catch (e) {
            return e;
        }
    };



    const RegisterInLadders = (_id) => {
        history.push(`/insideladder/?lid=${_id}`);
    }

    return (
        <Layout header={true} footer={true}>
            <div className="statistics-page">
                <div className="main-wrapper">
                    <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />
                    <div className="middle-wrapper">
                        <div className="ladder-page-section">
                            <LadderHeader handleClose={handleClose} SearchLadders={SearchLadders} searchData={searchData} running={true} isladders={isladders} />
                            <div className="ladderimg ">
                                <LadderBox ladders={ladders} RegisterInLadders={RegisterInLadders} />
                            </div>

                            {show && <CreateLadder show={show} values={values} handleClose={handleClose} errors={errors} OnChange={OnChange} selectLadderGameType={selectLadderGameType} SelectDate={SelectDate} handleImageChange={handleImageChange} handleCreateLadder={handleCreateLadder} />}
                        </div>
                    </div>
                    <RightSidebar />
                </div>

            </div>
        </Layout>
    )
}
export default LadderPage;
