import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import { handleSuccessfulLogin } from "utils/auth";

export default function SignIn() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "gray.200");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Success",
        description: "Logged in successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      handleSuccessfulLogin(history);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      maxW={{ base: "100%", md: "max-content" }}
      w="100%"
      mx={{ base: "auto", lg: "0px" }}
      me="auto"
      h="100%"
      alignItems="start"
      justifyContent="center"
      mb={{ base: "12px", md: "0px" }}
      px={{ base: "0px", lg: "0px" }}
      mt={{ base: "40px", lg: "14vh" }}
      flexDirection="column"
      position="relative"
    >
      <Box me="auto">
        <Heading color={textColor} fontSize="36px" mb="10px">
          Sign In
        </Heading>
        <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400">
          Enter your email and password to sign in!
        </Text>
      </Box>
      <Flex
        zIndex="2"
        direction="column"
        w={{ base: "100%", md: "420px" }}
        maxW="100%"
        background="transparent"
        borderRadius="15px"
        maxH={{ base: "420px", md: "100%" }}
        p={{ base: "40px 20px", lg: "20px" }}
        me={{ base: "auto", lg: "0px" }}
      >
        <FormControl>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            Email<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            type="email"
            placeholder="mail@simmmple.com"
            mb="24px"
            fontWeight="500"
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
            Password<Text color={brandStars}>*</Text>
          </FormLabel>
          <InputGroup size="md">
            <Input
              isRequired={true}
              fontSize="sm"
              placeholder="Min. 8 characters"
              mb="24px"
              ms={{ base: "0px", md: "0px" }}
              type={show ? "text" : "password"}
              variant="auth"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement display="flex" alignItems="center" mt="4px">
              <Icon
                cursor="pointer"
                color={textColorSecondary}
                _hover={{ color: "navy.700" }}
                as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={handleClick}
              />
            </InputRightElement>
          </InputGroup>
          <Flex justifyContent="space-between" align="center" mb="24px">
            <FormControl display="flex" alignItems="center">
              <Text
                justifyContent="center"
                alignItems="center"
                color={textColor}
                id="remember-login"
                cursor="pointer"
              >
                Keep me logged in
              </Text>
            </FormControl>
            <Text
              color={textColorBrand}
              fontSize="sm"
              w="124px"
              fontWeight="500"
              cursor="pointer"
            >
              Forgot password?
            </Text>
          </Flex>
          <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </FormControl>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          maxW="100%"
          mt="0px"
        >
          <Text color={textColorDetails} fontWeight="400">
            Not registered yet?
            <Text
              as="span"
              ms="5px"
              color={textColorBrand}
              fontWeight="500"
              cursor="pointer"
              onClick={() => history.push("/auth/sign-up")}
            >
              Create an Account
            </Text>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
