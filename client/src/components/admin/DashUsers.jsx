import { Badge, Button, Modal, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes, FaUser, FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineSearch } from "react-icons/ai";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showMore, setShowMore] = useState(true);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [inputValue, setInputValue] = useState(""); // State to track input value

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/v1/user/getusers`);
        const data = await res.json();
        if (data.success === false) {
          return toast.error(data.message);
        }
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/v1/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (data.success === false) {
        return toast.error(data.message);
      }
      setUsers((prev) => [...prev, ...data.users]);
      if (data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const handleDeleteUser = async () => {
    setOpenModal(false);
    try {
      const res = await fetch(`/api/v1/user/delete/${userIdToDelete}`, {
        method: `DELETE`,
      });
      const data = await res.json();
      if (data.success === false) {
        return toast.error(data.message);
      }
      setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

   const handleSubmit = async (e) => {
     e.preventDefault();
     // If inputValue is empty, navigate to all products
     const searchTerm = inputValue.trim()
       ? `?searchTerm=${encodeURIComponent(inputValue)}`
       : "";
 
     try {
       const res = await fetch(`/api/v1/user/getusers${searchTerm}`);
       const data = await res.json();
       if (data.success === false) {
         return toast.error(data.message);
       }
       setUsers(data.users);
       setShowMore(data.users.length === 9);
     } catch (error) {
       toast.error(error);
     }
   };

  return (
    <div className="w-[80%] table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <form
            onSubmit={handleSubmit}
            className=" lg:flex justify-between items-center mt-2 mb-10 gap-5 border-b py-2"
          >
            <div className="flex justify-center items-center">
              <h1 className="mx-2">Search User : </h1>
              <TextInput
                id="search"
                type="text"
                placeholder="Search users by username, email..."
                className="w-80"
                value={inputValue} // Controlled input
                onChange={handleInputChange} // Update state on input change
              />
              <Button
                type="submit"
                gradientDuoTone="tealToLime"
                className="w-8 h-8 -ml-9  border-2 border-solid border-teal-500"
                pill
              >
                <AiOutlineSearch />
              </Button>
            </div>
            <div className="mt-5 lg:mt-0">
              <Badge
                className="px-5 py-3 text-black font-semibold text-base"
                icon={FaUsers}
              >
                <span className="">Total Users : </span>
                {totalUsers}
              </Badge>
            </div>
          </form>

          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-300 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          <div className="flex justify-center py-7">
            {showMore && (
              <Button
                onClick={handleShowMore}
                type="button"
                gradientDuoTone="purpleToBlue"
                outline
              >
                Show More
              </Button>
            )}
          </div>
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashUsers;
