import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';

const Leaderboard = () => {
    const [topEarners, setTopEarners] = useState([]);
    const [topAdClickers, setTopAdClickers] = useState([]);
    const [currentUserRank, setCurrentUserRank] = useState(null); // To store current user's rank

    useEffect(() => {
        fetchTopEarners();
        fetchTopAdClickers();
    }, []);

    const fetchTopEarners = () => {
        fetch('https://dripdash.onrender.com/api/top-earners')
            .then(response => response.json())
            .then(data => {
                setTopEarners(data);
                // Find current user's rank
                const user = data.find(user => user.username === 'YourUsername'); // Replace 'YourUsername' with actual username
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

    const scrollToUserRank = () => {
        const element = document.getElementById('userRank');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <h1 className="text-center">Leaderboard</h1>
            <Button variant="primary" onClick={scrollToUserRank}>Find My Rank</Button>
            <h2 className="text-center">Top Earners</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Weekly Earnings</th>
                    </tr>
                </thead>
                <tbody>
                    {topEarners.map((user, index) => (
                        <tr key={index} id={user.username === 'YourUsername' ? 'userRank' : null}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.weeklyEarnings}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h2 className="text-center">Top Ad Clickers</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Ads Clicked</th>
                    </tr>
                </thead>
                <tbody>
                    {topAdClickers.map((user, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.adsClicked}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* Display current user's rank */}
            {currentUserRank && (
                <p className="text-center">Your rank: {currentUserRank}</p>
            )}
        </div>
    );
};

export default Leaderboard;
