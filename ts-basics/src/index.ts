// Basic types
let id: number = 5
let ids: number[] = [1, 2, 3, 4, 5]
let myName: string = 'Yu ZHANG'
let isTrue: boolean = true
let x: any = 'Hello World'

// Tuple
let person: [number, string, boolean] = [1, 'Yu ZHANG', true]

// Tuple Array
let employee: [number, string][]

employee = [
    [1, 'Yu ZHANG'],
    [2, 'Yu ZHANG'],
]

// Union
let pid: string | number = 22

// Enum
enum Direction1 {
    Up  = 1,
    Down,
    Left,
    Right,
}

enum Direction2 {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right',
}

// Object
type User = {
    id: number,
    name: string,
}

type Point = User | string

const user: User = {
    id: 1,
    name: 'Yu ZHANG',
}

// Type Assertion
let cid: any = 1
let customerId1 = <number>cid
let customerId2 = cid as number

// Functions
function addNum(x: number, y: number): number {
    return x + y
}

// Void
function log(message: string | number): void {
    console.log(message)
}

// Type Interface
interface UserInterface {
    readonly id: number,
    name: string,
    // Optional
    age?: number,
}

const user1: UserInterface = {
    id: 1,
    name: 'Yu ZHANG',
}

//  Function Interface
interface MathFunc {
    (x: number, y: number): number
}

const add: MathFunc = (x: number, y: number): number => x + y

// Class

interface PersonInterface {
    id: number,
    name: string,
    register(): string,
}

class Person implements PersonInterface {
    // protected | private | public (default)
    id: number
    name: string

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }

    register() {
        return `${this.name} is now registered`
    }
}

const person1 = new Person(1, 'Yu ZHANG')

class Employee extends Person {
    position: string

    constructor(id: number, name: string, position: string) {
        super(id, name)
        this.position = position
    }

    changePosition(position: string) {
        this.position = position
    }
}

const employee1 = new Employee(1, 'Yu ZHANG', 'Developer')
employee1.changePosition('Senior Developer')

// Generics
function getArray<T>(items: T[]): T[] {
    return new Array().concat(items)
}

let numArray = getArray<number>([1, 2, 3, 4])
let strArray = getArray<string>(['Yu', 'Zhang'])

numArray.push(5)
strArray.push('Hello')