import React, { useState, useEffect } from 'react';
import { useFirebase } from './UserRoleContext';
import { Table, Button, Form } from 'react-bootstrap';
import WeeklyWinnersModal from './WeeklyWinnersModal';

const Leaderboard = () => {
    const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, isUserAnonymous, setIsUserAnonymous } = useFirebase();
    const [topEarners, setTopEarners] = useState([]);
    const [topAdClickers, setTopAdClickers] = useState([]);
    const [selectedTable, setSelectedTable] = useState('topEarners');
    const [currentUserRank, setCurrentUserRank] = useState(null); // To store current user's rank
    const [anonymous, setAnonymous] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const fetchTopEarners = () => {
        fetch('https://dripdash.onrender.com/api/top-earners')
            .then(response => response.json())
            .then(data => {
                setTopEarners(data);
                // Find current user's rank
                const user = data.find(user => user.name === userFullName); // Replace 'YourUsername' with actual username
                if (user) setCurrentUserRank(data.indexOf(user) + 1);
            })
            .catch(error => console.error('Error fetching top earners:', error));
    };

    const fetchTopAdClickers = () => {
        fetch('https://dripdash.onrender.com/api/top-ad-clickers')
            .then(response => response.json())
            .then(data => setTopAdClickers(data))
            .catch(error => console.error('Error fetching top ad clickers:', error));
    };

    useEffect(() => {

        fetchTopEarners();
        fetchTopAdClickers();
    }, [fetchTopEarners]);


    const scrollToUserRank = () => {
        const element = document.getElementById('userRank');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const handleTableToggle = (table) => {
        setSelectedTable(table);
    };

    const handleAnonymousToggle = () => {
        setAnonymous(!anonymous);
        // Send a request to update the user's anonymity preference
        fetch('https://dripdash.onrender.com/api/update-anonymity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ anonymous: !anonymous, userID }), // Toggle the current anonymity preference
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update anonymity preference');
                }
                // Handle success
            })
            .catch(error => console.error('Error updating anonymity preference:', error));
    };

    return (
        <div>
            <h1 className="text-center display-5">Leaderboard</h1>
            <Button className='mx-2 bg-theme sc-rank' variant="primary" onClick={scrollToUserRank}>Find My Rank</Button>
           <div className='text-center mx-2'> <span className='bold'>Note: </span> Users at the top of the board get payments at the end of every week.</div>
            <div className="text-center my-3">
                <Button
                    className={selectedTable === 'topEarners' ? 'bg-theme p-2' : 'border-theme no-bg text-theme'}
                    onClick={() => handleTableToggle('topEarners')}
                    style={{ borderRadius: '0.25rem 0 0 0.25rem' }} // Apply border radius only to the left edge
                >
                    Top Earners
                </Button>
                <Button
                    className={selectedTable === 'topAdClickers' ? 'bg-theme p-2' : 'border-theme no-bg text-theme'}
                    onClick={() => handleTableToggle('topAdClickers')}
                    style={{ borderRadius: '0 0.25rem 0.25rem 0' }} // Apply border radius only to the right edge
                >
                    Top Ad Clickers
                </Button>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
                <div>
                <Form.Check
                type="switch"
                id="anonymousSwitch"
                label="Stay Anonymous"
                checked={isUserAnonymous}
                onChange={handleAnonymousToggle}
                className="ml-3 mx-2"
                />
                </div>
                {/*  */}
                <div>
                    <button onClick={handleButtonClick} className='border-theme rounded-pill mx-2 bg-white p-1 text-theme bold'>Check Winners</button>
                    <WeeklyWinnersModal showModal={showModal} onClose={handleCloseModal} />
                </div>
            </div>
            <div className='border-theme m-2 table-responsive' style={{ height: '300px', borderRadius: '12px',  overflow: 'auto' }}>
                {selectedTable === 'topEarners' && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Weekly Referrals</th>
                                <th>Weekly Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topEarners.map((user, index) => (
                                <tr key={index} id={user.userId === userID ? 'userRank' : null}>
                                    <td>{index + 1}</td>
                                    <td className={user.userId === userID ? 'text-danger bold' : ''}>{user.isAnonymous ? 'Anonymous' : user.name}</td>
                                    <td>{user.weeklyReferrals || '-'}</td>
                                    {/* <td>{anonymous ? 'Confidential' : user.weeklyEarnings}</td> */}
                                    <td>₦{user.weeklyEarnings || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                {selectedTable === 'topAdClickers' && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Ads Clicked</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topAdClickers.map((user, index) => (
                                <tr key={index} id={user.userId === userID ? 'userRank' : null}>
                                    <td>{index + 1}</td>
                                    <td className={user.userId === userID ? 'text-danger bold' : ''}>{user.isAnonymous ? 'Anonymous' : user.name}</td>
                                    {/* <td>{anonymous ? 'Confidential' : user.adsClicked}</td> */}
                                    <td>{user.adsClicked || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
            {/* Display current user's rank */}
            {currentUserRank && (
                <p className="text-center">Your rank: {currentUserRank}</p>
            )}
        </div>
    );
};

export default Leaderboard;
