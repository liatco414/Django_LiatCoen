import { useEffect, useState } from "react";
import { GetUserProfileById } from "../services/usersService";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../CSS/profile.css";
import ppUserImage from "../images/pp_user.jpeg";

function UserProfile() {
    const [userProfile, setUserProfile] = useState(false);
    const { profileId } = useParams();

    useEffect(() => {
        const fecthUserProfile = async () => {
            if (!profileId) {
                console.error("No profile ID provided!");
                return;
            }
            try {
                const response = await GetUserProfileById(profileId);
                if (response) {
                    setUserProfile(response);
                }
            } catch (error) {
                console.log(error.response?.data);
            }
        };
        fecthUserProfile();
    }, [profileId]);

    return (
        <>
            <div className="profile">
                <h1 style={{ paddingTop: "80px" }}>User Profile</h1>
                <div className="dets">
                    <div className="row1">
                        <div className="userImage">
                            <img className="pp" src={userProfile.profile_pic === null ? ppUserImage : userProfile.profile_pic} alt="user profile pic" />
                            <p>{userProfile.username}</p>
                        </div>
                    </div>
                    <div className="row2">
                        <div className="title">
                            <p>bio:</p>
                            <div className="content bio">
                                <p> {!userProfile.bio ? "News enthusiastic!" : userProfile.bio}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row3">
                        <div className="title">
                            <p>Phone:</p>
                            <div className="content">
                                <p>{userProfile.phone}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row4">
                        <p>Location</p>
                    </div>
                    <div className="row5">
                        <div className="title">
                            <p>Country:</p>
                            <div className="content">
                                <p>{userProfile.country}</p>
                            </div>
                        </div>
                        <div className="title">
                            <p>City:</p>
                            <div className="content">
                                <p>{userProfile.city}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row6">
                        <div className="title">
                            <p>Address</p>
                            <div className="content">
                                <p>{`${userProfile.street}, ${userProfile.house_number}`}</p>
                            </div>
                        </div>
                    </div>
                    <div className="profile-btn">
                        <Link to={`/edit-profile/${userProfile.id}`} className="btn btn-dark">
                            Update Info
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserProfile;
