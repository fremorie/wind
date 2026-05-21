import { ModelInstances } from './ModelInstances'
import { WindTurbineModel } from './WindTurbineModel'

export function Models() {
    return (
        <ModelInstances>
            <WindTurbineModel position={[-5, 0, 3]} />
            <WindTurbineModel position={[0, 0, 0]} />
            <WindTurbineModel position={[5, 0, -3]}/>
        </ModelInstances>
    )
}