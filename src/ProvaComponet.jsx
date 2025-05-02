export default function ProvaComponet()
{
    const dati = [
        {id: "2025-04-25T00:00", temp: 15, code: 1},
        {id: "2025-04-25T01:00", temp: 15, code: 1}
    ];
    console.log(dati);
    
    return(
        <>
                <table>
                <tbody>
                {dati.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.temp}</td>
                        <td>{item.code}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}