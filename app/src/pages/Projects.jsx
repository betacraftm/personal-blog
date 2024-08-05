import { Table } from "flowbite-react";

export default function Projects() {
  return (
    <div className="mx-auto min-h-screen">
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="my-7 text-center text-3xl font-semibold">My Projects</h1>
        <p className="text-center text-gray-500">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id itaque
          reiciendis aut expedita provident veritatis consequuntur architecto ut
          deleniti, suscipit beatae voluptatibus vitae delectus? Ea possimus
          consectetur reprehenderit culpa deleniti.
        </p>
        <div className="table-auto overflow-x-scroll p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 md:mx-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Project</Table.HeadCell>
              <Table.HeadCell>Github Repo</Table.HeadCell>
              <Table.HeadCell>Demo Link</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell className="font-semibold">React ChatApp</Table.Cell>
                <Table.Cell>
                  <a
                    target="_blank"
                    href={"https://github.com/betacraftm/mern-chatapp"}
                    className="text-blue-500 hover:underline"
                    rel="noopener noreferrer"
                  >
                    https://github.com/betacraftm/mern-chatapp
                  </a>
                </Table.Cell>
                <Table.Cell>
                  <a
                    target="_blank"
                    href={"https://mern-chatapp-rr9s.onrender.com/"}
                    className="text-blue-500 hover:underline"
                    rel="noopener noreferrer"
                  >
                    View Demo
                  </a>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">Trello Clone</Table.Cell>
                <Table.Cell>
                  <a
                    target="_blank"
                    href={"https://github.com/betacraftm/frontend-trello-clone"}
                    className="text-blue-500 hover:underline"
                    rel="noopener noreferrer"
                  >
                    https://github.com/betacraftm/frontend-trello-clone
                  </a>
                </Table.Cell>
                <Table.Cell>
                  <a
                    target="_blank"
                    href={"https://trello-clone-jpxa.onrender.com/"}
                    className="text-blue-500 hover:underline"
                    rel="noopener noreferrer"
                  >
                    View Demo
                  </a>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">To Do List</Table.Cell>
                <Table.Cell>
                  <a
                    target="_blank"
                    href={"https://github.com/betacraftm/to-do-list"}
                    className="text-blue-500 hover:underline"
                    rel="noopener noreferrer"
                  >
                    https://github.com/betacraftm/to-do-list
                  </a>
                </Table.Cell>
                <Table.Cell>
                  <a
                    target="_blank"
                    href={"https://to-do-list-qu8a.onrender.com/"}
                    className="text-blue-500 hover:underline"
                    rel="noopener noreferrer"
                  >
                    View Demo
                  </a>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">Calculator</Table.Cell>
                <Table.Cell>
                  <a
                    target="_blank"
                    href={"https://github.com/betacraftm/project-calculator"}
                    className="text-blue-500 hover:underline"
                    rel="noopener noreferrer"
                  >
                    https://github.com/betacraftm/project-calculator
                  </a>
                </Table.Cell>
                <Table.Cell>
                  <a
                    target="_blank"
                    href={"https://betacraftm.github.io/project-calculator/"}
                    className="text-blue-500 hover:underline"
                    rel="noopener noreferrer"
                  >
                    View Demo
                  </a>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
