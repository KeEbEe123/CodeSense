"use client";

import React, { useState, useEffect } from "react";

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/leaderboard");
            const data = await response.json();
            setLeaderboard(data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    return (
        <div>
            <h1>Leaderboard</h1>
            <button onClick={fetchLeaderboard} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh Leaderboard"}
            </button>

            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Total Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((user, index) => (
                        <tr key={user.email}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.totalScore}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
