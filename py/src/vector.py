
class GenericVector(object):
    from math import sqrt as _sqrt
    def __init__(self, coordinates_list=None):
        super().__init__()
        if coordinates_list is None:
            self._coords = [0, 0]
        else:
            self._coords = list(coordinates_list)

    def __abs__(self):
        return self._sqrt(sum(map(lambda x: x * x, self._coords)))

    def __add__(self, vec):
        res = []
        for i in range(len(self._coords)):
            res.append(self._coords[i] + vec._coords[i])
        return GenericVector(coordinates_list=res)

    def __eq__(self, vec):
        return self._coords == vec._coords

    def __sub__(self, vec):
        res = []
        for i in range(len(self._coords)):
            res.append(self._coords[i] - vec._coords[i])
        return GenericVector(coordinates_list=res)

    @property
    def copy(self):
        if type(self) == GenericVector:
            return GenericVector(self._coords)
        else:
            return type(self)(*self._coords)

    @property
    def length(self):
        return abs(self)


class Vector2(GenericVector):
    def __init__(self, x=0, y=0):
        super().__init__([x, y])

    @property
    def x(self):
        return self._coords[0]

    @x.setter
    def x(self, val):
        self._coords[0] = float(val)

    @property
    def y(self):
        return self._coords[1]

    @y.setter
    def y(self, val):
        self._coords[1] = float(val)


class Vector3(Vector2):
    def __init__(self, x=0, y=0, z=0):
        super().__init__(x=x, y=y)
        self._coords.append(z)

    @property
    def z(self):
        return self._coords[2]

    @z.setter
    def z(self, val):
        self._coords[2] = float(val)


import unittest

class GenericVectorTestCase(unittest.TestCase):
    from random import random
    from random import randint
    def test_length(self):
        v = GenericVector([3, 0, 4])
        self.assertEqual(v.length, 5)

        v = GenericVector([3, 0, 0, 4, 0])
        self.assertEqual(v.length, 5)

        v = GenericVector([1, 1, 1, 1])
        self.assertEqual(v.length, 2)

        v = GenericVector([1, -1, 0, -1, 0, 0])
        self.assertAlmostEqual(v.length, 1.73205, places=5)

    def test_eq(self):
        v1 = GenericVector([1, 1, -1])
        v2 = GenericVector([1, -1, 1])
        v3 = GenericVector([-1, 1, 1])
        v4 = GenericVector([1, 1, -1])

        self.assertEqual(v1, v4)
        self.assertNotEqual(v1, v2)
        self.assertNotEqual(v1, v3)
        self.assertNotEqual(v2, v3)
        self.assertNotEqual(v2, v4)
        self.assertNotEqual(v3, v4)

    def test_add(self):
        for i in range(10):
            l1 = [self.randint(-10, 10) + self.random() for _ in range(10)]
            l2 = [self.randint(-10, 10) + self.random() for _ in range(10)]
            expected = list(map(lambda x: x[0] + x[1], zip(l1, l2)))

            v1 = GenericVector(l1)
            v2 = GenericVector(l2)
            res = GenericVector(expected)

            with self.subTest(v1=v1, v2=v2, res=res):
                self.assertEqual(v1 + v2, res)
                self.assertEqual(v1 + v2, v2 + v1)

    def test_sub(self):
        for i in range(10):
            l1 = [self.randint(-10, 10) + self.random() for _ in range(10)]
            l2 = [self.randint(-10, 10) + self.random() for _ in range(10)]
            expected = list(map(lambda x: x[0] - x[1], zip(l1, l2)))

            v1 = GenericVector(l1)
            v2 = GenericVector(l2)
            res = GenericVector(expected)

            with self.subTest(v1=v1, v2=v2, res=res):
                self.assertEqual(v1 - v2, res)

    def test_copy(self):
        l1 = [self.randint(-10, 10) + self.random() for _ in range(10)]
        v1 = GenericVector(l1)
        v2 = v1.copy

        self.assertEqual(v1, v2)
        self.assertFalse(v1 is v2)


class Vector3TestCase(unittest.TestCase):
    def test_constructor(self):
        v1 = Vector3()
        v2 = Vector3(x=1, y=-1, z=3)

        with self.subTest(v1=v1):
            self.assertEqual(v1.x, 0)
            self.assertEqual(v1.y, 0)
            self.assertEqual(v1.z, 0)

        with self.subTest(v2=v2):
            self.assertEqual(v2.x, 1)
            self.assertEqual(v2.y, -1)
            self.assertEqual(v2.z, 3)

    def test_copy(self):
        v1 = Vector3(x=1, y=-1, z=2)
        v2 = v1.copy

        with self.subTest(v1=v1, v2=v2):
            self.assertEqual(v1, v2)
            self.assertFalse(v1 is v2)

        with self.subTest(v2=v2):
            self.assertEqual(type(v2), Vector3)
            self.assertEqual(v2.x, 1)
            self.assertEqual(v2.y, -1)
            self.assertEqual(v2.z, 2)

if __name__ == '__main__':
    unittest.main()
