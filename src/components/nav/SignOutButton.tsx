import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@nextui-org/react";
import { RCJIcon } from "../icons/RCJIcon";

const SignOutButton = () => {
  const { user, signOut } = useAuthenticator();
  if (user) {
    console.log("SIgnedIN");
  }
  return (
    <div className="flex mt-10 mx-10 justify-between items-start">
      <div>
        <RCJIcon />
      </div>
      {user ? (
        <div className="flex flex-col gap-3 ml-auto ">
          <Button
            variant="ghost"
            color="danger"
            size="md"
            onPress={signOut}
            className="ml-auto">
            Sign Out
          </Button>
          <h1 className="text-xs md:text-xl text-zinc-600/60 ml-auto">
            {" "}
            Signed in as {user.username}
          </h1>
        </div>
      ) : null}
    </div>
  );
};

export default SignOutButton;
