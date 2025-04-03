import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Image,
  Text,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { handleAuthError } from "utils/auth";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [newProduct, setNewProduct] = useState({
    title: "",
    variants: [
      {
        price: "",
        sku: ""
      }
    ],
    images: [
      {
        src: "",
        altText: ""
      }
    ]
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const toast = useToast();
  const history = useHistory();
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleAuthError({ status: 401 }, history);
          return;
        }

        const response = await fetch("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            handleAuthError({ status: 401 }, history);
            return;
          }
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const transformedProducts = data.edges.map(edge => ({
          _id: edge?.node?.id,
          title: edge?.node?.title,
          options: edge?.node?.options || [],
          price: edge?.node?.variants?.edges?.[0]?.node?.price || "0",
          sku: edge?.node?.variants?.edges?.[0]?.node?.sku || "",
          imageUrl: edge?.node?.images?.edges?.[0]?.node?.src || "",
        }));
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (error.status === 401) {
          handleAuthError(error, history);
          return;
        }
        toast({
          title: "Error",
          description: "Failed to fetch products",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [history, toast]);

  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError({ status: 401 }, history);
        return;
      }

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError({ status: 401 }, history);
          return;
        }
        throw new Error("Failed to create product");
      }

      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, {
        _id: data.id,
        title: data.title,
        options: data.options || [],
        price: newProduct.variants[0].price,
        sku: newProduct.variants[0].sku,
        imageUrl: newProduct.images[0].src
      }]);
      onClose();
      setNewProduct({
        title: "",
        variants: [
          {
            price: "",
            sku: ""
          }
        ],
        images: [
          {
            src: "",
            altText: ""
          }
        ]
      });
      toast({
        title: "Success",
        description: "Product created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      if (error.status === 401) {
        handleAuthError(error, history);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError({ status: 401 }, history);
        return;
      }

      const productIdParts = productId?.split("/") || [];
      const extractedId = productIdParts.length > 0 ? productIdParts.pop() : productId;

      const response = await fetch(
        `http://localhost:5000/api/products/${extractedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError({ status: 401 }, history);
          return;
        }
        throw new Error("Failed to delete product");
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      toast({
        title: "Success",
        description: "Product deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.status === 401) {
        handleAuthError(error, history);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  return (
    <Box>
      <Flex direction="column" align="center" mb={4}>
        <Flex align="center" w="100%" maxW="400px" mb={4}>
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            mr={2}
          />
          <SearchIcon color="gray.400" />
        </Flex>
        <Button 
          colorScheme="blue" 
          onClick={onOpen}
          size="lg"
          bg="blue.600"
          _hover={{ bg: "blue.700" }}
          _active={{ bg: "blue.800" }}
        >
          Add Product
        </Button>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort("title")}>
                Title
              </Th>
              <Th cursor="pointer" onClick={() => handleSort("price")}>
                Price
              </Th>
              <Th cursor="pointer" onClick={() => handleSort("sku")}>
                SKU
              </Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedProducts.map((product) => (
              <Tr key={product._id}>
                <Td>{product.title}</Td>
                <Td>${product.price}</Td>
                <Td>{product.sku}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => {
                      setSelectedProduct(product);
                      onViewOpen();
                    }}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Create Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  placeholder="Enter product title"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  value={newProduct.variants[0].price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      variants: [{
                        ...newProduct.variants[0],
                        price: e.target.value,
                      }],
                    })
                  }
                  placeholder="Enter product price"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>SKU</FormLabel>
                <Input
                  value={newProduct.variants[0].sku}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      variants: [{
                        ...newProduct.variants[0],
                        sku: e.target.value,
                      }],
                    })
                  }
                  placeholder="Enter product SKU"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={newProduct.images[0].src}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      images: [{
                        ...newProduct.images[0],
                        src: e.target.value,
                        altText: newProduct.title
                      }],
                    })
                  }
                  placeholder="Enter image URL"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateProduct}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Product Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedProduct && (
              <VStack spacing={4} align="stretch">
                <Text>
                  <strong>Title:</strong> {selectedProduct.title}
                </Text>
                <Text>
                  <strong>Price:</strong> ${selectedProduct.price}
                </Text>
                <Text>
                  <strong>SKU:</strong> {selectedProduct.sku}
                </Text>
                {selectedProduct.options && selectedProduct.options.length > 0 && (
                  <Box>
                    <Text fontWeight="bold">Options:</Text>
                    {selectedProduct.options.map((option, index) => (
                      <Text key={index}>
                        {option.name}: {option.optionValues.map(v => v.name).join(", ")}
                      </Text>
                    ))}
                  </Box>
                )}
                {selectedProduct.imageUrl && (
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title}
                    maxH="200px"
                    objectFit="contain"
                  />
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onViewClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Products; 