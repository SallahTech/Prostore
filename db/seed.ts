import {PrismaClient} from '@prisma/client'
import sampleData from "@/db/sample-data";
import {hash} from "@/lib/encryp";


async function main() {
    const prisma = new PrismaClient()
    await prisma.product.deleteMany()
    await prisma.account.deleteMany()
    await prisma.session.deleteMany()
    await prisma.verificationToken.deleteMany()
    await prisma.user.deleteMany()

    await prisma.product.createMany({data: sampleData.products})
    const users = []

    for (let i = 0; i < sampleData.users.length; i++) {
        users.push({
            ...sampleData.users[i],
            password: await hash(sampleData.users[i].password)
        })
    }

    await prisma.user.createMany({data: users})

    console.log("PRISMA: Database seeded successfully!")
}

main()
