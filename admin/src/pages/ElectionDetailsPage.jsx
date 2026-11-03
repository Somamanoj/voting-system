import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { fetchElectionById } from '../services/api';

const ElectionDetailsPage = () => {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadElectionDetails = async () => {
      try {
        const data = await fetchElectionById(id);
        setElection(data);
        console.log(data)
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    loadElectionDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading election details: {error.message}</div>;
  }

  if (!election) {
    return <div>No election found</div>;
  }

  // Prepare data for charts
  const votesData = election.candidates.map(candidate => ({
    name: candidate.name,
    votes: candidate.votesCount
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Election Header */}
        <div className="flex items-center mb-6">
          {election.image && (
            <img
              src={election.image}
              alt={election.title}
              className="w-32 h-32 object-cover rounded-lg mr-6"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
            <p className="text-gray-600">{election.description}</p>
            <div className="text-sm text-gray-500 mt-2">
              <span>Location: {election.location}</span>
              <span className="ml-4">
                Duration: {new Date(election.startDate).toLocaleDateString()} -
                {new Date(election.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Candidates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {election.candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="bg-gray-100 rounded-lg p-4 shadow-sm"
              >
                {candidate.logo && (
                  <img
                    src={candidate.logo}
                    alt={candidate.name}
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                  />
                )}
                <h3 className="text-xl font-medium text-center">{candidate.name}</h3>
                <p className="text-gray-600 text-center">{candidate.partyName}</p>
                <p className="text-gray-600 text-center">{candidate.manifesto}</p>
                <div className="mt-4 text-center">
                  <p className="font-bold text-lg">Votes: {candidate.votesCount}</p>
                  {/* <p className="text-sm text-gray-500">Founded: {candidate.foundedYear}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Votes Distribution Pie Chart */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Votes Distribution</h2>
            <PieChart width={400} height={400}>
              <Pie
                data={votesData}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="votes"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {votesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Bar Chart for Votes */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Candidate Votes</h2>
            <BarChart width={400} height={400} data={votesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionDetailsPage;