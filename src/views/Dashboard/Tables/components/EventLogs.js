import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Select,
  Input,
  FormControl,
  FormLabel,
  Flex,
  useToast,
  Text,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useHistory } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";

const EventLogs = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventType, setEventType] = useState("");
  const [userId, setUserId] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [chartData, setChartData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.800");
  const history = useHistory();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          history.push("/signin");
          return;
        }

        const response = await fetch("http://localhost:5000/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
        processChartData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to fetch events",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [history, toast]);

  useEffect(() => {
    filterEvents();
  }, [events, eventType, userId, dateRange]);

  const processChartData = (eventsData) => {
    const groupedData = eventsData.reduce((acc, event) => {
      const date = new Date(event.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, count: 0 };
      }
      acc[date].count++;
      return acc;
    }, {});

    const chartDataArray = Object.values(groupedData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    setChartData(chartDataArray);
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (eventType) {
      filtered = filtered.filter((event) => event.event_type === eventType);
    }

    if (userId) {
      filtered = filtered.filter((event) => event.user_id === userId);
    }

    if (dateRange.start) {
      filtered = filtered.filter(
        (event) => new Date(event.timestamp) >= new Date(dateRange.start)
      );
    }

    if (dateRange.end) {
      filtered = filtered.filter(
        (event) => new Date(event.timestamp) <= new Date(dateRange.end)
      );
    }

    setFilteredEvents(filtered);
  };

  const eventTypes = ["CREATE", "UPDATE", "DELETE"];
  const uniqueUserIds = [...new Set(events.map((event) => event.user_id))];

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Flex align="center" flex={1} maxW="400px">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            mr={2}
          />
          <SearchIcon color="gray.400" />
        </Flex>
      </Flex>

      {isLoading ? (
        <Text>Loading events...</Text>
      ) : events.length === 0 ? (
        <Text>No events found. Start creating products to see events here.</Text>
      ) : (
        <>
          <Box mb={8}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Event Activity Over Time
            </Text>
            <Box bg={bgColor} p={4} borderRadius="lg" height="400px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    name="Events"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box mb={4}>
            <Flex gap={4} wrap="wrap">
              <FormControl maxW="200px">
                <FormLabel>Event Type</FormLabel>
                <Select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl maxW="200px">
                <FormLabel>User ID</FormLabel>
                <Select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                >
                  <option value="">All Users</option>
                  {uniqueUserIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl maxW="200px">
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </FormControl>

              <FormControl maxW="200px">
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </FormControl>
            </Flex>
          </Box>

          <Box bg={bgColor} borderRadius="lg" p={4}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Timestamp</Th>
                  <Th>Event Type</Th>
                  <Th>User ID</Th>
                  <Th>Product ID</Th>
                  <Th>Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredEvents.map((event) => (
                  <Tr key={event.id}>
                    <Td>{new Date(event.timestamp).toLocaleString()}</Td>
                    <Td>{event.event_type}</Td>
                    <Td>{event.user_id}</Td>
                    <Td>{event.product_id}</Td>
                    <Td>{event.details}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EventLogs; 