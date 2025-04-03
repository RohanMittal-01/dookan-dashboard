// Chakra imports
import { Box, Text } from "@chakra-ui/react";
import React from "react";

function Tables() {
  return (
    <Box pt={{ base: "120px", md: "75px" }}>
      <Text fontSize="xl" fontWeight="bold">
        Tables have been moved to their respective routes:
      </Text>
      <Text mt={4}>
        • Products table is now at <strong>/products</strong>
      </Text>
      <Text>
        • Event logs table is now at <strong>/events</strong>
      </Text>
    </Box>
  );
}

export default Tables;
