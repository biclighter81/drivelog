import { Drivelog, Vehicle } from '@prisma/client';
import { InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/vehicle');
  const data = (await res.json()) as (Vehicle & {
    drivelogs: Array<Drivelog>;
  })[];
  return {
    props: {
      vehicles: data,
    },
  };
}

export default function StaticPage({
  vehicles,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <>{JSON.stringify(vehicles)}</>;
}
