import { Badge, Grid, Input, Table, Text, Timeline } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { Doughnut } from 'react-chartjs-2';
import { GasStation, Road, Search } from 'tabler-icons-react';
import dayjs from 'dayjs';
import { InferGetServerSidePropsType } from 'next';
import { prisma } from '../lib/prisma';
import { Drivelog, User } from '@prisma/client';
import { useState } from 'react';
import useUser from '../lib/authentication/useUser';

export async function getServerSideProps() {
  return {
    props: {
      logs: JSON.parse(
        JSON.stringify(
          await prisma.drivelog.findMany({
            select: {
              comment: true,
              date: true,
              triplength: true,
              created_at: true,
              id: true,
              uid: true,
              user: true,
              updated_at: true,
              vehicle_plate: true,
            },
            orderBy: {
              date: 'desc',
            },
            take: 10,
          })
        )
      ) as (Drivelog & { user: User })[],
      usersProps: JSON.parse(
        JSON.stringify(
          await prisma.user.findMany({
            select: {
              name: true,
              prename: true,
              id: true,
              Drivelogs: true,
            },
            orderBy: {
              Drivelogs: {
                _count: 'desc',
              },
            },
            take: 10,
          })
        )
      ) as (User & { Drivelogs: Drivelog[] })[],
    },
  };
}

const Dashboard = ({
  logs,
  usersProps,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { user } = useUser({ redirectTo: '/auth/login' });

  const [drivelogs, setDrivelogs] = useState<typeof logs>(logs);
  const [users, setUsers] = useState<typeof usersProps>(usersProps);

  const data = {
    labels: [...users.map((u) => u.prename + ' ' + u.name)],
    datasets: [
      {
        label: 'Kilometer Verteilung pro Benutzer',
        data: [
          ...users.map((u) =>
            u.Drivelogs?.reduce((a, b) => a + b.triplength, 0)
          ),
        ],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  };

  const elements = [
    { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  ];

  //function which converts milliseconds to days, hours, minutes and seconds
  const convertMillisecondsString = (time: number) => {
    time = Math.abs(time);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${days ? days + ' Tag(en), ' : ''}${
      hours ? hours + ' Stunde(n), ' : ''
    }${minutes ? minutes + ' Minute(n)' : ''}`;
  };

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td>{element.position}</td>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
      <td>{element.mass}</td>
    </tr>
  ));

  return (
    true && (
      <>
        <h1 className='text-2xl font-black mb-12'>Timeline</h1>

        <div className=''>
          <Timeline
            active={drivelogs.length}
            bulletSize={32}
            lineWidth={2}
            color={'indigo'}
          >
            {drivelogs.map((log) => (
              <Timeline.Item
                key={log.id}
                bullet={<Road size={18} />}
                title={
                  <div>
                    <div>
                      <Badge color={'indigo'} size='md'>
                        + {log.triplength.toFixed(2)} KM
                      </Badge>
                    </div>
                  </div>
                }
              >
                <Text color='dimmed' size='sm'>
                  {log.user.prename} {log.user.name} ist{' '}
                  {log.triplength.toFixed(2)} KM mit dem Fahrzeug{' '}
                  {log.vehicle_plate} gefahren.
                </Text>
                <Text size='xs' mt={4}>
                  {convertMillisecondsString(dayjs(new Date()).diff(log.date))
                    ? 'vor ' +
                      convertMillisecondsString(
                        dayjs(new Date()).diff(log.date)
                      )
                    : 'gerade eben'}
                </Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>

        <h1 className='text-2xl font-black mb-12 mt-12'>Statistik Kilometer</h1>
        <Doughnut data={data} className='max-h-[350px]' />

        <h1 className='text-2xl font-black mb-12 mt-12'>Fahrten Suche</h1>

        <div>
          <div>
            <Grid>
              <Grid.Col span={6}>
                <DatePicker
                  placeholder='Datum auswählen'
                  label='Startdatum'
                  required
                  locale='de'
                  defaultValue={dayjs().add(-1, 'day').toDate()}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePicker
                  placeholder='Datum auswählen'
                  label='Enddatum'
                  required
                  locale='de'
                  defaultValue={new Date()}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Input
                  icon={<Search />}
                  placeholder='Suche...'
                  className='mb-4'
                />
              </Grid.Col>
            </Grid>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Element position</th>
                <th>Element name</th>
                <th>Symbol</th>
                <th>Atomic mass</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      </>
    )
  );
};

export default Dashboard;
