import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsGithub } from "react-icons/bs";

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="max-w-7x mx-auto w-full">
        <div className="grid w-full justify-between sm:flex">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg font-bold dark:text-white sm:text-xl"
            >
              <span className="rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 py-1 text-white">
                Betacraft's
              </span>
              Blog
            </Link>
          </div>
          <div className="mt-4 flex gap-8 sm:gap-6">
            <div>
              <Footer.LinkGroup>
                <Footer.Link className="hover:cursor-pointer" as={"div"}>
                  <Link to={"/"}>Home</Link>
                </Footer.Link>
                <Footer.Link className="hover:cursor-pointer" as={"div"}>
                  <Link to={"/dashboard?tab=profile"}>Profile</Link>
                </Footer.Link>
                <Footer.Link className="hover:cursor-pointer" as={"div"}>
                  <Link to={"/about"}>About</Link>
                </Footer.Link>
                <Footer.Link className="hover:cursor-pointer" as={"div"}>
                  <Link to={"/projects"}>Projects</Link>
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            by="Betacraft's Blog"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex gap-6 sm:mt-0 sm:justify-center">
            <Footer.Icon
              href="https://www.facebook.com/ngocdat204"
              icon={BsFacebook}
              target="_blank"
              rel="noopener noreferrer"
            />
            <Footer.Icon
              href="https://github.com/betacraftm"
              icon={BsGithub}
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
