import {
  Accordion,
  Badge,
  Button,
  Grid,
  Group,
  Input,
  NumberInput,
  Text,
  TextInput,
} from '@mantine/core';
import { formList, useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { Drivelog, Vehicle } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';
import { ChangeEvent, useState } from 'react';
import {
  Car,
  Clipboard,
  Dashboard,
  Motorbike,
  Plus,
  Refresh,
} from 'tabler-icons-react';
import { prisma } from '../lib/prisma';

//Server Side Request
export async function getServerSideProps() {
  return {
    props: {
      veh: JSON.parse(
        JSON.stringify(
          await prisma.vehicle.findMany({
            select: {
              plate: true,
              name: true,
              mileage: true,
              drivelogs: true,
            },
          })
        )
      ) as (Vehicle & { drivelogs: Drivelog[] })[],
    },
  };
}

export default function Vehciles({
  veh,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [vehicles, setVehicles] = useState<typeof veh>(veh);
  const vehicleForm = useForm({
    initialValues: {
      name: '',
      plate: '',
      mileage: 0,
    },
    validate: {
      name: (value) =>
        value.length < 3
          ? 'Fahrzeugname muss mindestens 3 Zeichen haben!'
          : undefined,
      plate: (value) =>
        /[A-ZÖÜÄ]{1,3}[ -][A-ZÖÜÄ]{1,2}[ -][1-9]{1}[0-9]{0,3}/.test(value)
          ? null
          : 'Ungültiges Nummernschild angegeben!',
      mileage: (value) =>
        value < 0 ? 'Kilometerstand muss positiv sein!' : undefined,
    },
  });

  const handleSubmitVehicle = async () => {
    const values = vehicleForm.values;
    const res = await fetch('/api/vehicle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = (await res.json()) as Error;
      return showNotification({
        title: 'Fehler beim Speichern',
        message: err.message,
      });
    }
    const data = (await res.json()) as Vehicle & { drivelogs: Drivelog[] };
    setVehicles([...vehicles, data]);
  };

  //Client Side Request
  const handleRefresh = async () => {
    try {
      const res = await fetch('/api/vehicle');
      const data = (await res.json()) as (Vehicle & {
        drivelogs: Drivelog[];
      })[];
      setVehicles(data);
    } catch (e) {
      console.error('failed fetching vehicles');
    }
  };

  return (
    <>
      <h1 className='text-2xl font-black mb-12'>Fahrzeuge</h1>

      <form onSubmit={vehicleForm.onSubmit(() => handleSubmitVehicle())}>
        <Grid className='mb-12'>
          <Grid.Col span={12} sm={6}>
            <TextInput
              placeholder='Nummernschild'
              required
              icon={<Clipboard />}
              {...vehicleForm.getInputProps('plate')}
            />
          </Grid.Col>
          <Grid.Col span={12} sm={6}>
            <TextInput
              placeholder='Fahrzeugname'
              required
              icon={<Car />}
              {...vehicleForm.getInputProps('name')}
            />
          </Grid.Col>
          <Grid.Col span={12} sm={6}>
            <NumberInput
              placeholder='Kilometerstand'
              required
              icon={<Dashboard />}
              {...vehicleForm.getInputProps('mileage')}
            />
          </Grid.Col>
          <Grid.Col>
            <Button
              leftIcon={<Plus />}
              color={'green'}
              variant={'light'}
              type={'submit'}
            >
              Fahrzeug anlegen
            </Button>
          </Grid.Col>
        </Grid>
      </form>

      <div>
        <Group>
          <Button
            leftIcon={<Refresh />}
            color='indigo'
            variant='light'
            onClick={() => handleRefresh()}
          >
            Aktualisieren
          </Button>
        </Group>
      </div>

      <Accordion>
        {vehicles.map((vehicle) => (
          <Accordion.Item
            key={vehicle.plate}
            label={
              <div>
                <Group>
                  <Badge color={'indigo'} px={'sm'} py={'sm'}>
                    <Car />
                  </Badge>
                  <Text color={'dark'}>{vehicle.plate}</Text>
                </Group>
              </div>
            }
          >
            <Group>
              <Text>
                <strong>Kilometerstand:</strong>
                <Badge size='lg' ml={'sm'}>
                  {vehicle.mileage.toFixed(2)} KM
                </Badge>
              </Text>
              <Text>
                <strong>Fahrzeugname:</strong>
                <Badge size='lg' color={'green'} ml={'sm'}>
                  {vehicle.name}
                </Badge>
              </Text>
              <Text>
                <strong>Anzahl Fahrten:</strong>
                <Badge size='lg' color={'yellow'} ml={'sm'}>
                  {vehicle.drivelogs?.length ?? 0}
                </Badge>
              </Text>
            </Group>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}
